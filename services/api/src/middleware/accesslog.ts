import util from "node:util";
import ENV from "@api/env.ts";
import dayjs from "dayjs";
import jwt from "jwt-simple";
import type Koa from "koa";
import prettyBytes from "pretty-bytes";

// ip, date, method, path, http version, status and length
const LOG_FORMAT = '%s [UFPRINT=%s] [UID=%s] [%s] "%s %s HTTP/%s" %d %s %dms\n';

const accesslog = (patterns_to_ignore: string[] = []) => {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    const start = Date.now();
    await next();
    const end = Date.now();
    const duration = end - start;

    const fingerprint = ctx.request.headers["x-fingerprint"] ?? "";

    const { id: user_id } = ctx.request.headers.authorization
      ? jwt.decode(ctx.request.headers.authorization, ENV.JWT_SECRET)
      : { id: null };

    for (const pattern of patterns_to_ignore) {
      if (ctx.path === pattern) return;
    }

    process.stdout.write(
      util.format(
        LOG_FORMAT,
        ctx.ip,
        fingerprint,
        user_id,
        dayjs().format("YYYY-MM-DD HH:mm:ss"),
        ctx.method,
        ctx.path,
        ctx.req.httpVersion,
        ctx.status,
        ctx.length ? prettyBytes(+ctx.length.toString(), { space: false }) : "-",
        duration,
      ),
    );
  };
};

export default accesslog;
