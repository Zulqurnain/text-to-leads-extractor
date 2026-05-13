-- Run this in Supabase SQL Editor to set up the database

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  cv_path text,
  cv_summary text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile data"
  on public.profiles for update
  using (auth.uid() = id);

-- Email connections (Gmail, Outlook, Yahoo OAuth tokens)
create table if not exists public.email_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null check (provider in ('gmail', 'outlook', 'yahoo')),
  email text not null,
  access_token text not null,
  refresh_token text,
  created_at timestamptz default now(),
  unique (user_id)
);

alter table public.email_connections enable row level security;

create policy "Users can read their own connections"
  on public.email_connections for select
  using (auth.uid() = user_id);

-- CVs storage bucket (private)
-- Run this in Supabase dashboard → Storage → New bucket: cvs (private)
-- Or run: insert into storage.buckets (id, name, public) values ('cvs', 'cvs', false);
