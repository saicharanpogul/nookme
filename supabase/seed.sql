-- ═══════════════════════════════════════════════════════════
-- NookMe — Seed Data Function
-- Run this in Supabase SQL Editor AFTER schema.sql
-- Creates sample nooks + content for each new user
-- ═══════════════════════════════════════════════════════════

create or replace function seed_user_data(target_user_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  nook1_id uuid;
  nook2_id uuid;
  nook3_id uuid;
  card1_id uuid;
  card2_id uuid;
  card3_id uuid;
  card4_id uuid;
  card5_id uuid;
begin
  -- ─── Create Nook 1: Meme Lords ────────────────────────────
  nook1_id := gen_random_uuid();
  insert into nooks (id, name, description, icon_name, color, created_by)
  values (nook1_id, '🔥 Meme Lords', 'The dankest corner of the internet', 'flame', '#FF9500', target_user_id);

  insert into nook_members (nook_id, user_id, role)
  values (nook1_id, target_user_id, 'owner');

  -- ─── Create Nook 2: Startup Gang ─────────────────────────
  nook2_id := gen_random_uuid();
  insert into nooks (id, name, description, icon_name, color, created_by)
  values (nook2_id, '🚀 Startup Gang', 'Ship fast, break things', 'rocket', '#5856D6', target_user_id);

  insert into nook_members (nook_id, user_id, role)
  values (nook2_id, target_user_id, 'owner');

  -- ─── Create Nook 3: Travel Inspo ─────────────────────────
  nook3_id := gen_random_uuid();
  insert into nooks (id, name, description, icon_name, color, created_by)
  values (nook3_id, '✈️ Travel Inspo', 'Wanderlust & bucket lists', 'airplane', '#5AC8FA', target_user_id);

  insert into nook_members (nook_id, user_id, role)
  values (nook3_id, target_user_id, 'owner');

  -- ─── Content Cards for Meme Lords ────────────────────────
  card1_id := gen_random_uuid();
  insert into content_cards (id, nook_id, shared_by, url, title, description, platform, creator, tags)
  values (
    card1_id, nook1_id, target_user_id,
    'https://instagram.com/reel/example1',
    'This cat learned to open doors 🐱',
    'Wait for it... the ending is insane',
    'instagram', '@catlovers',
    array['funny', 'cats']
  );

  card2_id := gen_random_uuid();
  insert into content_cards (id, nook_id, shared_by, url, title, description, platform, creator, tags)
  values (
    card2_id, nook1_id, target_user_id,
    'https://instagram.com/reel/example2',
    'When your code works on the first try',
    'Every developer knows this feeling',
    'instagram', '@devhumor',
    array['coding', 'memes']
  );

  -- ─── Content Cards for Startup Gang ──────────────────────
  card3_id := gen_random_uuid();
  insert into content_cards (id, nook_id, shared_by, url, title, description, platform, creator, tags)
  values (
    card3_id, nook2_id, target_user_id,
    'https://youtube.com/watch?v=example',
    'How to Build a $1M SaaS in 2026',
    'Step-by-step guide from zero to exit',
    'youtube', 'TechFounder',
    array['startup', 'saas']
  );

  card4_id := gen_random_uuid();
  insert into content_cards (id, nook_id, shared_by, url, title, description, platform, creator, tags)
  values (
    card4_id, nook2_id, target_user_id,
    'https://medium.com/article-example',
    'Why Most Startups Fail in Year 2',
    'A deep dive into the valley of death',
    'web', 'StartupInsights',
    array['startup', 'business']
  );

  -- ─── Content Card for Travel Inspo ───────────────────────
  card5_id := gen_random_uuid();
  insert into content_cards (id, nook_id, shared_by, url, title, description, platform, creator, tags)
  values (
    card5_id, nook3_id, target_user_id,
    'https://tiktok.com/@travelvlog/video/example',
    'POV: You discover this hidden waterfall',
    'Absolutely breathtaking',
    'tiktok', '@travelvlog',
    array['travel', 'nature']
  );

  -- ─── Sample Messages ─────────────────────────────────────
  insert into messages (card_id, sender_id, text) values
    (card1_id, target_user_id, 'LMAOOO this is literally me every morning 😂'),
    (card1_id, target_user_id, 'The part where the cat just STARES at the camera 💀'),
    (card3_id, target_user_id, 'This is gold. Saving for later.'),
    (card5_id, target_user_id, 'Adding this to the bucket list immediately 🌊');

  -- ─── Sample Reactions ─────────────────────────────────────
  insert into reactions (card_id, user_id, emoji) values
    (card1_id, target_user_id, '😂'),
    (card2_id, target_user_id, '🔥'),
    (card3_id, target_user_id, '🤯'),
    (card4_id, target_user_id, '💯'),
    (card5_id, target_user_id, '❤️');
end;
$$;

-- Grant execute to authenticated users (the auth store calls this)
grant execute on function seed_user_data(uuid) to authenticated;
