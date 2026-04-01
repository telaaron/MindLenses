-- MindLenses intake storage schema for Supabase
-- Run this in Supabase SQL Editor for the selected project.

create extension if not exists "pgcrypto";

create table if not exists public.intake_requests (
  id text primary key,
  type text not null check (type in ('express', 'corporate')),
  status text not null check (status in ('new', 'approved', 'in_progress', 'waiting_customer', 'completed', 'rejected')),
  priority text not null check (priority in ('normal', 'high')),
  payment_state text not null check (payment_state in ('none', 'pending_after_approval', 'link_sent', 'paid')),
  payment_link text,
  sla_due_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  source text not null default 'website' check (source in ('website')),
  requester_name text not null,
  requester_email text not null,
  requester_company text not null default '',
  title text not null,
  summary text not null,
  details jsonb not null default '{}'::jsonb,
  notes text not null default ''
);

create index if not exists intake_requests_created_at_idx on public.intake_requests (created_at desc);
create index if not exists intake_requests_status_idx on public.intake_requests (status);
create index if not exists intake_requests_type_idx on public.intake_requests (type);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_intake_requests_updated_at on public.intake_requests;
create trigger set_intake_requests_updated_at
before update on public.intake_requests
for each row
execute function public.set_updated_at();

-- Optional: disable RLS for this internal admin table
alter table public.intake_requests disable row level security;
