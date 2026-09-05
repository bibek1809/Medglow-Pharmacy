import { Pool } from 'pg'

const createTableSql = `
create table if not exists public.admin_reports (
  id uuid primary key default gen_random_uuid(),
  report_date date not null unique,
  total_sales numeric(12,2) not null default 0 check (total_sales >= 0),
  total_customers integer not null default 0 check (total_customers >= 0),
  offline_customers integer not null default 0 check (offline_customers >= 0),
  offline_sales numeric(12,2) not null default 0 check (offline_sales >= 0),
  tiktok_customers integer not null default 0 check (tiktok_customers >= 0),
  tiktok_sales numeric(12,2) not null default 0 check (tiktok_sales >= 0),
  instagram_customers integer not null default 0 check (instagram_customers >= 0),
  instagram_sales numeric(12,2) not null default 0 check (instagram_sales >= 0),
  whatsapp_customers integer not null default 0 check (whatsapp_customers >= 0),
  whatsapp_sales numeric(12,2) not null default 0 check (whatsapp_sales >= 0),
  expenses numeric(12,2) not null default 0 check (expenses >= 0),
  online_percentage numeric(6,2) generated always as (case when total_sales > 0 then greatest(0, least(100, ((tiktok_sales + instagram_sales + whatsapp_sales) / total_sales) * 100)) else 0 end) stored,
  offline_percentage numeric(6,2) generated always as (case when total_sales > 0 then greatest(0, least(100, (offline_sales / total_sales) * 100)) else 0 end) stored,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  notes text
);
create index if not exists admin_reports_report_date_idx on public.admin_reports(report_date desc);
create index if not exists admin_reports_created_by_idx on public.admin_reports(created_by);
alter table public.admin_reports enable row level security;
drop policy if exists admin_reports_admin_all on public.admin_reports;
create policy admin_reports_admin_all on public.admin_reports for all to authenticated using (coalesce((select auth.jwt() -> 'app_metadata' ->> 'is_admin'), 'false') = 'true') with check (coalesce((select auth.jwt() -> 'app_metadata' ->> 'is_admin'), 'false') = 'true');
grant usage on schema public to authenticated, service_role;
grant select, insert, update, delete on table public.admin_reports to authenticated, service_role;
notify pgrst, 'reload schema';
`

let pool: Pool | undefined
let bootstrapPromise: Promise<void> | undefined

function getPool() {
  if (pool) return pool
  const connectionString = process.env.POSTGRES_URL_NON_POOLING_2 ?? process.env.POSTGRES_URL_2 ?? process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_URL
  if (!connectionString) throw new Error('Report database connection is not configured')
  pool = new Pool({ connectionString, max: 1, idleTimeoutMillis: 10_000, connectionTimeoutMillis: 5_000, ssl: { rejectUnauthorized: false } })
  return pool
}

export function ensureAdminReportsTable() {
  if (!bootstrapPromise) {
    bootstrapPromise = getPool().query(createTableSql).then(() => undefined).catch((error) => {
      bootstrapPromise = undefined
      throw error
    })
  }
  return bootstrapPromise
}
