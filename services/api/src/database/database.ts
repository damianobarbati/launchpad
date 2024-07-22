import ENV from '@api/env.ts';
import knex from 'knex';
import pg from 'pg';
import config from './config';

pg.types.setTypeParser(pg.types.builtins.TEXT, String);
pg.types.setTypeParser(pg.types.builtins.NUMERIC, Number);
pg.types.setTypeParser(pg.types.builtins.INT2, Number);
pg.types.setTypeParser(pg.types.builtins.INT4, Number);
pg.types.setTypeParser(pg.types.builtins.INT8, Number);
pg.types.setTypeParser(pg.types.builtins.FLOAT4, Number);
pg.types.setTypeParser(pg.types.builtins.FLOAT8, Number);
pg.types.setTypeParser(pg.types.builtins.TIMESTAMP, (value) => (value === null ? null : new Date(value).toISOString().replace(/\.\d+/, '')));
pg.types.setTypeParser(pg.types.builtins.TIMESTAMPTZ, (value) => (value === null ? null : new Date(value).toISOString().replace(/\.\d+/, '')));

const database = knex(config);

// we run only in local environment, because in remote environments this is delegated to kube health check relying on the /health endpoint
if (ENV.APP_ENV === 'local') await database.raw('SELECT 1 /* no-log */');

export default database;
