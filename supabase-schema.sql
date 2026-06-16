-- ─────────────────────────────────────────────
-- 모임 앱 · Supabase 스키마 + RLS
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 RUN
-- ─────────────────────────────────────────────

create table if not exists rules_consent (
  member     text primary key,
  agreed     boolean not null default false,
  agreed_at  timestamptz
);

create table if not exists schedules (
  id         uuid primary key default gen_random_uuid(),
  date       date not null,
  title      text not null,
  memo       text,
  created_by text,
  created_at timestamptz default now()
);

create table if not exists transactions (
  id         uuid primary key default gen_random_uuid(),
  type       text not null check (type in ('입금','지출')),
  amount     integer not null check (amount >= 0),
  memo       text,
  date       date not null default current_date,
  created_by text,
  created_at timestamptz default now()
);

create table if not exists config (
  key   text primary key,
  value text
);

insert into config (key, value) values
  ('account_bank',   '토스뱅크'),
  ('account_number', '000-0000-0000'),
  ('account_holder', '모임'),
  ('join_guide',     '토스 앱 > 모임통장 > 초대링크 수락 > 자동이체 등록'),
  ('rules_text',     '1. 매달 회비 자동이체\n2. 불참 시 전날까지 공유\n3. 회칙은 협의로 변경')
on conflict (key) do nothing;

alter table rules_consent enable row level security;
alter table schedules     enable row level security;
alter table transactions  enable row level security;
alter table config        enable row level security;

create policy "auth all consent" on rules_consent for all to authenticated using (true) with check (true);
create policy "auth all sched"   on schedules     for all to authenticated using (true) with check (true);
create policy "auth all tx"      on transactions  for all to authenticated using (true) with check (true);
create policy "auth all config"  on config        for all to authenticated using (true) with check (true);
