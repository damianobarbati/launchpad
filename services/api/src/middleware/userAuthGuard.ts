import asyncStorage from "@api/asyncStorage.ts";
import AuthService from "@api/auth/AuthService.ts";
import type { User } from "@type/User.ts";
import createHttpError from "http-errors";
import type Koa from "koa";

const authed = async (ctx: Koa.BaseContext, next: Koa.Next) => {
  const token = ctx.request.headers.authorization?.replace("Bearer ", "");
  if (!token) throw createHttpError(401);

  let user: User | null;
  try {
    user = await AuthService.getUserByToken(token);
    if (!user) throw createHttpError(401, "User not found for this token.");
  } catch (error) {
    throw createHttpError(401, "Token not valid.");
  }

  ctx.user = user;
  await asyncStorage.run(ctx, next);
};

export default authed;
