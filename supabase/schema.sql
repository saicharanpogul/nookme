-- ═══════════════════════════════════════════════════════════
-- NookMe — Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

-- ─── Waitlist (already created) ────────────────────────────
-- create table waitlist (
--   id uuid primary key default gen_random_uuid(),
--   email text unique not null,
--   created_at timestamptz default now()
-- );

-- ─── Profiles ──────────────────────────────────────────────
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  username text unique not null,
  avatar_color text default '#007AFF',
  created_at timestamptz default now()
);

-- ─── Nooks ─────────────────────────────────────────────────
create table nooks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon_name text default 'people',
  color text default '#007AFF',
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- ─── Nook Members ──────────────────────────────────────────
create table nook_members (
  nook_id uuid references nooks(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  role text default 'member' check (role in ('owner', 'admin', 'member')),
  joined_at timestamptz default now(),
  primary key (nook_id, user_id)
);

-- ─── Content Cards ─────────────────────────────────────────
create table content_cards (
  id uuid primary key default gen_random_uuid(),
  nook_id uuid references nooks(id) on delete cascade,
  shared_by uuid references profiles(id),
  url text not null,
  title text,
  description text,
  platform text check (platform in ('instagram', 'youtube', 'twitter', 'tiktok', 'web')),
  creator text,
  tags text[] default '{}',
  created_at timestamptz default now()
);

-- ─── Messages (threads) ───────────────────────────────────
create table messages (
  id uuid primary key default gen_random_uuid(),
  card_id uuid references content_cards(id) on delete cascade,
  sender_id uuid references profiles(id),
  text text not null,
  created_at timestamptz default now()
);

-- ─── Reactions ─────────────────────────────────────────────
create table reactions (
  id uuid primary key default gen_random_uuid(),
  card_id uuid references content_cards(id) on delete cascade,
  user_id uuid references profiles(id),
  emoji text not null,
  created_at timestamptz default now(),
  unique(card_id, user_id, emoji)
);

-- ═══════════════════════════════════════════════════════════
-- Row Level Security Policies
-- ═══════════════════════════════════════════════════════════

-- ─── Profiles ──────────────────────────────────────────────
alter table profiles enable row level security;

create policy "Users can view any profile"
  on profiles for select to authenticated
  using (true);

create policy "Users can update own profile"
  on profiles for update to authenticated
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert to authenticated
  with check (auth.uid() = id);

-- ─── Nooks ─────────────────────────────────────────────────
alter table nooks enable row level security;

create policy "Members can view their nooks"
  on nooks for select to authenticated
  using (
    id in (select nook_id from nook_members where user_id = auth.uid())
  );

create policy "Authenticated users can create nooks"
  on nooks for insert to authenticated
  with check (created_by = auth.uid());

create policy "Nook owners can update"
  on nooks for update to authenticated
  using (created_by = auth.uid());

-- ─── Nook Members ──────────────────────────────────────────
alter table nook_members enable row level security;

create policy "Members can view nook members"
  on nook_members for select to authenticated
  using (
    nook_id in (select nook_id from nook_members where user_id = auth.uid())
  );

create policy "Nook owners can add members"
  on nook_members for insert to authenticated
  with check (
    nook_id in (select id from nooks where created_by = auth.uid())
    or user_id = auth.uid()
  );

-- ─── Content Cards ─────────────────────────────────────────
alter table content_cards enable row level security;

create policy "Members can view content in their nooks"
  on content_cards for select to authenticated
  using (
    nook_id in (select nook_id from nook_members where user_id = auth.uid())
  );

create policy "Members can share content"
  on content_cards for insert to authenticated
  with check (
    shared_by = auth.uid()
    and nook_id in (select nook_id from nook_members where user_id = auth.uid())
  );

-- ─── Messages ──────────────────────────────────────────────
alter table messages enable row level security;

create policy "Members can view messages"
  on messages for select to authenticated
  using (
    card_id in (
      select id from content_cards where nook_id in (
        select nook_id from nook_members where user_id = auth.uid()
      )
    )
  );

create policy "Members can send messages"
  on messages for insert to authenticated
  with check (
    sender_id = auth.uid()
    and card_id in (
      select id from content_cards where nook_id in (
        select nook_id from nook_members where user_id = auth.uid()
      )
    )
  );

-- ─── Reactions ─────────────────────────────────────────────
alter table reactions enable row level security;

create policy "Members can view reactions"
  on reactions for select to authenticated
  using (
    card_id in (
      select id from content_cards where nook_id in (
        select nook_id from nook_members where user_id = auth.uid()
      )
    )
  );

create policy "Members can add reactions"
  on reactions for insert to authenticated
  with check (
    user_id = auth.uid()
    and card_id in (
      select id from content_cards where nook_id in (
        select nook_id from nook_members where user_id = auth.uid()
      )
    )
  );

create policy "Users can remove own reactions"
  on reactions for delete to authenticated
  using (user_id = auth.uid());
