import ENV from "@api/env.ts";

if (ENV.NODE_ENV !== "test") throw new Error("NODE_ENV=test must be provided when running tests.");

export const setup = async () => {};

export const teardown = async () => {};
