export const FIELD_SEPARATOR = "/";
export const ID_SEPARATOR = ":";

export const ALL = "*";

export const RESOURCES = ["*", "notifications", "permissions", "roles", "users"] as const;
export type RESOURCE = (typeof RESOURCES)[number];

export const ACTIONS = ["*", "create", "delete", "read", "update"] as const;
export type ACTION = (typeof ACTIONS)[number];

export type PermissionRow = {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  action: ACTION;
  resource_type: RESOURCE;
  resource_id: string;
  resource_owner_id: string;
};

export type PermissionRowInsert = Partial<PermissionRow> &
  NonNullable<Pick<PermissionRow, "user_id" | "action" | "resource_type" | "resource_id" | "resource_owner_id">>;

export type PermissionRowUpdate = Partial<PermissionRow>;

export type Permission = PermissionRow;
