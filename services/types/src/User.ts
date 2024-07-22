import type { ROLE } from '@type/Role';
import type { VapidSubscription } from './Notification';
import type { Permission } from './Permission';

export type UserRow = {
  id: string;
  logistics_ex_id: string | null;
  logistics_synced_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  creator_id: string;
  owner_id: string;
  email: string;
  role: ROLE;
  name: string;
  company_name: string;
  phone: string | null;
  address: string | null;
  timezone: string | null;
  vapid_subscription: VapidSubscription | null;
};

export type UserRowInsert = Partial<UserRow> & NonNullable<Pick<UserRow, 'creator_id' | 'owner_id' | 'email' | 'role' | 'name' | 'company_name'>>;

export type UserRowUpdate = Omit<Partial<UserRow>, 'id'>;

// tofix: put this in a zod schema
export type UserCreate = Omit<UserRowInsert, 'creator_id' | 'owner_id'> & {
  creator_id?: string;
  owner_id?: string;
  send_credentials: boolean;
};

export type UserUpdate = UserRowUpdate & {
  isActive?: boolean;
};

export type User = UserRow & {
  owner_logistics_ex_id: string | null;
  permissions: Permission[];
  isActive: boolean;
};

export type UserFormValues = UserRow;
