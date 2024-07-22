import { AsyncLocalStorage } from 'node:async_hooks';
import ENV from '@api/env';
import { getUserFromAsyncStorageOrNull } from '@api/helpers';
import hasPermission from '@api/permission/hasPermission.ts';
import { truncate } from '@common/helpers';
import database from '@database/database';
import type { ACTIVITY_ACTION, ActivityRow } from '@type/Activity';
import type { ACTION, RESOURCE } from '@type/Permission';
import createHttpError from 'http-errors';
import type { Knex } from 'knex';

type RepositoryConfiguration = {
  tableName: RESOURCE;
  softDelete?: boolean;
  enforcePermissions?: boolean;
  registerActivity?: boolean;
};

export const trxContext = new AsyncLocalStorage<Knex.Transaction>();

export const runInTransaction = async (fn: any, trx_timeout = 30_000): Promise<any> => {
  const trx = await database.transaction();

  let timeoutHandler: NodeJS.Timeout | undefined = undefined;
  const timeoutPromise = new Promise((_, reject) => {
    // we take the reference of the timeout to clear it if trx succeeds before time, otherwise will have hanging events preventing the process from exiting
    timeoutHandler = setTimeout(() => reject(new Error(`Transaction took more than ${trx_timeout}s to process.`)), trx_timeout);
  });

  const resultPromise = trxContext.run(trx, async () => {
    // all the methods call from now on, can use trxContext.getStore() to get the current transaction
    const result = await fn(trx);
    return result;
  });

  try {
    const result = await Promise.race([resultPromise, timeoutPromise]);
    if (timeoutHandler) clearTimeout(timeoutHandler);
    await trx.commit();
    return result;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};

export const getDatabase = (): Knex.Transaction | Knex => trxContext.getStore() || database;

export default class Repository<Resource, ResourceRow, ResourceRowInsert, ResourceRowUpdate> {
  constructor(public configuration: RepositoryConfiguration) {}

  async get(id: string): Promise<Resource | null> {
    const query = getDatabase()(this.configuration.tableName).select().where({ id }).first();
    if (this.configuration.softDelete) void query.whereNull('deleted_at');
    void this.enforcePermissions('read', query);
    const row = await query;
    if (!row) return null;
    const result = await this.populate(row);
    return result;
  }

  async getBy(input: Partial<ResourceRow>, any = false): Promise<Resource | null> {
    const query = getDatabase()(this.configuration.tableName).select().first();

    // get first row matching all provided columns
    if (!any) {
      void query.where(input);
    }
    // get first row matching any of the provided columns
    else {
      for (const [column, value] of Object.entries(input)) {
        void query.orWhere(column, value as any);
      }
    }

    if (this.configuration.softDelete) void query.whereNull('deleted_at');
    void this.enforcePermissions('read', query);
    const row = await query;
    if (!row) return null;
    const result = await this.populate(row);
    return result;
  }

  async getAll(input: Partial<ResourceRow> & { sort?: [keyof ResourceRow, 'desc' | 'asc']; limit?: number; deleted?: boolean } = {}): Promise<Resource[]> {
    const query = getDatabase()(this.configuration.tableName).select().returning('*');

    const { sort, limit, deleted, ...wheres } = input;

    void query.where(wheres);

    if (deleted) void query.whereNotNull('deleted_at');
    else if (this.configuration.softDelete) void query.whereNull('deleted_at');

    if (sort) void query.orderBy(...sort);
    void query.orderBy('created_at');
    if (limit) void query.limit(limit);

    void this.enforcePermissions('read', query);
    const rows = await query;
    const result = await this.populateAll(rows);
    return result;
  }

  async create(input: ResourceRowInsert): Promise<Resource> {
    void this.enforceCreatePermissions(input);
    const query = getDatabase()(this.configuration.tableName).insert(input).returning('*');
    const [row] = await query;
    if (this.configuration.registerActivity) void this.registerActivity('create', row.id);
    const result = await this.populate(row);
    return result;
  }

  async createOrUpdate(input: ResourceRowInsert, conflictedColumn: keyof ResourceRow | (keyof ResourceRow)[]): Promise<Resource> {
    const query = getDatabase()(this.configuration.tableName)
      .insert(input)
      .onConflict(conflictedColumn as any)
      .merge()
      .returning('*');
    // todo: implement enforcePermission for this case
    const [row] = await query;
    if (this.configuration.registerActivity) void this.registerActivity('update', row.id); // todo: either create a new action "upsert" or use "create" or "update"
    const result = await this.populate(row);
    return result;
  }

  async createAll(input: ResourceRowInsert[]): Promise<Resource[]> {
    const query = getDatabase()(this.configuration.tableName).insert(input).returning('*');
    for (const i of input) {
      void this.enforceCreatePermissions(i);
    }
    const rows = await query;
    if (this.configuration.registerActivity) {
      for (const row of rows) {
        void this.registerActivity('create', row.id);
      }
    }
    const result = await this.populateAll(rows);
    return result;
  }

  async createOrUpdateAll(input: ResourceRowInsert[], conflictedColumn: keyof ResourceRow | (keyof ResourceRow)[]): Promise<Resource[]> {
    const query = getDatabase()(this.configuration.tableName)
      .insert(input)
      .onConflict(conflictedColumn as any)
      .merge()
      .returning('*');
    // todo: implement enforcePermission for this case
    const rows = await query;
    if (this.configuration.registerActivity) {
      for (const row of rows) {
        void this.registerActivity('update', row.id); // todo: either create a new action "upsert" or use "create" or "update"
      }
    }
    const result = await this.populateAll(rows);
    return result;
  }

  async update(id: string, input: ResourceRowUpdate, andWhere: Partial<ResourceRow> = {}): Promise<Resource> {
    const query = getDatabase()(this.configuration.tableName).update(input).where({ id }).returning('*');

    for (const [column, value] of Object.entries(andWhere)) {
      if (value === null) void query.whereNull(column);
      else void query.where(column, value);
    }

    void this.enforcePermissions('update', query);
    const [resource] = await query;

    if (Object.keys(andWhere).length > 0 && !resource) {
      throw createHttpError(422, `Resource with id=${id} cannot be updated because it does not satisfy the where clause.`);
    }

    if (this.configuration.registerActivity) void this.registerActivity('update', resource.id);
    const result = await this.populate(resource);
    return result;
  }

  async remove(id: string): Promise<boolean> {
    const query = this.configuration.softDelete
      ? getDatabase()(this.configuration.tableName).update({ deleted_at: new Date().toISOString() }).where({ id }).returning('*')
      : getDatabase()(this.configuration.tableName).delete().where({ id }).returning('*');
    void this.enforcePermissions('delete', query);
    const [row] = await query;
    if (this.configuration.registerActivity) void this.registerActivity('delete', row.id);
    return !!row;
  }

  async removeBy(input: Partial<ResourceRow>): Promise<boolean> {
    const query = this.configuration.softDelete
      ? getDatabase()(this.configuration.tableName).update({ deleted_at: new Date().toISOString() }).where(input).returning('*')
      : getDatabase()(this.configuration.tableName).delete().where(input).returning('*');
    void this.enforcePermissions('delete', query);
    const rows = await query;
    if (this.configuration.registerActivity) {
      for (const row of rows) {
        void this.registerActivity('delete', row.id);
      }
    }
    const result = rows.length > 0;
    return result;
  }

  async exists(input: Partial<ResourceRow>): Promise<boolean> {
    const row = await getDatabase()(this.configuration.tableName).select().where(input).first();
    return !!row;
  }

  async populate(row: ResourceRow): Promise<Resource> {
    return Promise.resolve(row as unknown as Resource);
  }

  async populateAll(rows: ResourceRow[]): Promise<Resource[]> {
    const result: Resource[] = [];
    for (const row of rows) {
      const item = await this.populate(row);
      result.push(item);
    }
    return result;
  }

  async registerActivity(action: string, resource_id: string) {
    try {
      let user: { id: string; owner_id: string; name: string; role: string } | null = getUserFromAsyncStorageOrNull();
      if (!user) {
        user = {
          id: ENV.ADMIN_GROUP_ID,
          owner_id: ENV.ADMIN_GROUP_ID,
          name: 'System',
          role: 'ADMIN',
        };
      }
      const resource_type = this.configuration.tableName;
      const description = `${user.role} ${truncate(user.id, 8, '')} ${user.name}: ${action} '${resource_type}' with id=${resource_id}`;
      const query = getDatabase()<ActivityRow>('activities')
        .insert({
          generator_id: user.id,
          resource_type: this.configuration.tableName,
          resource_id,
          action: action as ACTIVITY_ACTION,
          creator_id: user.id,
          owner_id: user.owner_id, // Activities are owned by user's company
          type: 'audit',
          description,
        })
        .returning('*');
      await query;
    } catch (error) {
      console.error('Failed to register activity:', error);
    }
  }

  enforceCreatePermissions(row: any) {
    if (!this.configuration.enforcePermissions) return;

    const inputResource = row as unknown as { owner_id: string };
    const ownerId = inputResource.owner_id;
    if (!ownerId) throw createHttpError(400, `[${this.configuration.tableName}] Owner ID is required for write operations.`);

    const currentUser = getUserFromAsyncStorageOrNull();
    if (!currentUser) return;

    const permissions = currentUser.permissions.filter(
      (p) => (p.resource_type === this.configuration.tableName || p.resource_type === '*') && (p.action === 'create' || p.action === '*'),
    );

    if (!hasPermission(permissions, 'create', this.configuration.tableName, row.id || '*', ownerId)) {
      throw createHttpError(401, 'You do not have permission to perform this write operation.');
    }
  }

  enforcePermissions(action: ACTION, query: Knex.QueryBuilder<any>) {
    // todo: wildcard overwrites specific permissions
    if (!this.configuration.enforcePermissions) return query;

    const currentUser = getUserFromAsyncStorageOrNull();
    if (!currentUser) return query;

    const permissions = currentUser.permissions.filter(
      (p) => (p.resource_type === this.configuration.tableName || p.resource_type === '*') && (p.action === action || p.action === '*'),
    );

    if (!permissions.length) {
      return void query.whereRaw('false');
    }

    let permissionsCondition = '(';
    for (const permission of permissions) {
      let permissionCondition = '';
      if (permission.owner === '*' && permission.resource_id === '*') {
        permissionCondition += "true";
      } else if (permission.owner === '*' && permission.resource_id !== '*') {
        permissionCondition += `id = '${permission.resource_id}'`;
      } else if (permission.owner !== '*' && permission.resource_id === '*') {
        permissionCondition += `owner_id = '${permission.owner}'`;
      } else if (permission.owner !== '*' && permission.resource_id !== '*') {
        permissionCondition += `owner_id = '${permission.owner}' and id = '${permission.resource_id}'`;
      }
      permissionCondition = `(${permissionCondition}) OR `;
      permissionsCondition += permissionCondition;
    }
    permissionsCondition = permissionsCondition.slice(0, -4);
    permissionsCondition += ')';

    void query.whereRaw(permissionsCondition);
    return query;
  }
}
