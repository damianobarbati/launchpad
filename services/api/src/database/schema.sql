-- add support for UUID
create extension if not exists "uuid-ossp";

-- sua (set updated_at): set updated_at = now() when updating row (unless explicitly provided)
create or replace function sua() returns trigger language plpgsql as $$
begin
  new.updated_at = now()::timestamptz(0);
  return new;
end;
$$;

-- asu (array sort unique): sort array and remove duplicates
create or replace function asu (anyarray) returns anyarray language sql as $$
  select array(select distinct $1[s.i] from generate_series(array_lower($1,1), array_upper($1,1)) as s(i) order by 1);
$$;

drop table if exists "system_settings" cascade;
create table "system_settings" (
  "key" text not null unique,
  "value" text
);

drop table if exists "roles" cascade;
create table "roles" (
  "name" text not null primary key check (upper(name) = name),
  "created_at" timestamptz default now()::timestamptz(0) not null,
  "updated_at" timestamptz default now()::timestamptz(0) not null,
  "deleted_at" timestamptz,
  "description" text,
  "permission_templates" text[] default '{}'
);
create trigger "roles_sua" before update on "roles" for each row execute procedure sua();

drop table if exists "users" cascade;
create table "users" (
  "id" uuid default uuid_generate_v4() not null unique,
  "created_at" timestamptz default now()::timestamptz(0) not null,
  "updated_at" timestamptz default now()::timestamptz(0) not null,
  "deleted_at" timestamptz,
  "creator_id" uuid not null,
  "owner_id" uuid not null,
  "email" text not null unique,
  "password" text not null,
  "role" text not null check (lower(role) = role),
  "name" text not null,
  "company_name" text not null,
  "phone" text,
  "address" text,
  "timezone" text not null default 'UTC',
  vapid_subscription jsonb
);
create trigger "users_sua" before update on "users" for each row execute procedure sua();
alter table "users" add foreign key("creator_id") references "users" ("id") on update cascade on delete cascade;
alter table "users" add foreign key("owner_id") references "users" ("id") on update cascade on delete cascade;
alter table "users" add foreign key("role") references "roles" ("name") on update cascade on delete set null;
create unique index on "users" ("email");
create unique index on users (name) where role = 'group';

drop table if exists "permissions" cascade;
create table "permissions" (
  "id" uuid default uuid_generate_v4() not null unique,
  "created_at" timestamptz default now()::timestamptz(0) not null,
  "updated_at" timestamptz default now()::timestamptz(0) not null,
  "user_id" uuid not null,
  "action" text not null,
  "resource_type" text not null,
  "resource_id" text not null,
  "resource_owner_id" text not null
);
create trigger "permissions_sua" before update on "permissions" for each row execute procedure sua();
alter table "users" add foreign key("creator_id") references "users" ("id") on update cascade on delete cascade;
alter table "users" add foreign key("owner_id") references "users" ("id") on update cascade on delete cascade;
alter table "permissions" add foreign key("user_id") references "users" ("id") on update cascade on delete cascade;
create unique index on "permissions" ("user_id", "action", "resource_type", "resource_id", "resource_owner_id");
create index on "permissions" ("user_id");
create index on "permissions" ("resource_id");
