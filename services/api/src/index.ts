import http from "node:http";
import ENV from "@api/env";
import accesslog from "@api/middleware/accesslog.ts";
import router from "@api/router";
import cors from "@koa/cors";
import { isHttpError } from "http-errors";
import koa from "koa";
import json from "koa-better-json";
import { koaBody as body } from "koa-body";
import helmet from "koa-helmet";
import noTrailingSlash from "koa-no-trailing-slash";
import { ZodError } from "zod";

const app = new koa();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        imgSrc: ["'self'", "data:", "localhost:3001"],
        scriptSrc: ["'self'", "'unsafe-inline'", "localhost:3001"],
        workerSrc: ["'self'", "data:", "blob:"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(
  cors({ origin: (ctx) => ctx.get("Origin"), credentials: true, exposeHeaders: ["x-api-version", "x-fingerprint"] }),
);
app.use(noTrailingSlash());
app.use(body());
app.use(json({ pretty: true, spaces: 2 }));
if (ENV.NODE_ENV !== "test") app.use(accesslog(["/health", "/auth/me"]));

app.use(async (ctx: koa.BaseContext, next: koa.Next) => {
  try {
    ctx.set({ "x-version": ENV.GIT_HASH_VERSION });
    await next();
  } catch (error: unknown) {
    if (isHttpError(error)) {
      ctx.status = error.status;
      ctx.body = error.message;
    } else if (error instanceof ZodError) {
      ctx.status = 422;
      ctx.body = JSON.stringify(error.errors);
    } else {
      console.error(error);
      ctx.status = 500;
      ctx.body = "Internal server error.";
    }
  }
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(router.routes());

export const server = http.createServer(app.callback());

if (ENV.NODE_ENV !== "test") {
  server.listen(ENV.PORT, () => console.info(`Listening on port ${String(ENV.PORT)}`));
}
