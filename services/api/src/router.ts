import { HealthService } from "@api/health/HealthService.ts";
import Router from "@koa/router";
import createHttpError from "http-errors";

const router = new Router();

router.all("/health", async (ctx) => {
  const result = await HealthService.check();
  if (!result.status) ctx.status = 503;
  ctx.body = result;
});

router.all("(.*)", () => {
  throw createHttpError(404);
});

export default router;
