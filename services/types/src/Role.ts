export const ROLES = ["admin", "agent", "driver", "group"] as const;
export type ROLE = (typeof ROLES)[number];

export type RoleRow = {
  name: ROLE;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  description: string | null;
  permission_templates: string[];
};

export type RoleRowInsert = Partial<RoleRow> & NonNullable<Pick<RoleRow, "name">>;

export type RoleRowUpdate = Partial<RoleRow>;

export type Role = RoleRow;
