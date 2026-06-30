create table if not exists pages (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  slug           text unique not null,
  domain         text unique,
  status         text check (status in ('draft', 'published')) default 'draft',
  blocks         jsonb not null default '[]',
  config         jsonb not null default '{}',
  meta           jsonb not null default '{}',
  schema_version text not null default '1.0.0',
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- Seed MVP page (run after migration)
-- insert from supabase/seed/upscaly-consulting.json

alter table pages enable row level security;

create policy "public read published pages"
  on pages for select
  using (status = 'published');
