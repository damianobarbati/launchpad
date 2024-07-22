import type { Knex } from "knex";

export const up = async (database: Knex) => {
  await database.raw("");
};

export const down = Function.prototype;
