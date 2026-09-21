-- Diccionardo: datos públicos, sin moderación manual.
create table if not exists public.community_submissions (
  id uuid primary key default gen_random_uuid(),
  word text not null check (char_length(word) between 1 and 80),
  definition text not null check (char_length(definition) between 15 and 1200),
  example text check (char_length(example) <= 300),
  source text check (char_length(source) <= 500),
  created_at timestamptz not null default now()
);
create table if not exists public.word_reactions (
  id bigint generated always as identity primary key,
  word_slug text not null,
  fingerprint text not null,
  reaction smallint not null check (reaction in (-1, 1)),
  created_at timestamptz not null default now(),
  unique (word_slug, fingerprint)
);
create table if not exists public.site_visits (
  id bigint generated always as identity primary key,
  fingerprint text not null unique,
  last_seen_at timestamptz not null default now()
);
alter table public.community_submissions enable row level security;
alter table public.word_reactions enable row level security;
alter table public.site_visits enable row level security;
create policy "anyone can submit words" on public.community_submissions for insert to anon with check (true);
create policy "anyone can read submissions" on public.community_submissions for select to anon using (true);
create policy "anyone can react" on public.word_reactions for insert to anon with check (true);
create policy "anyone can update own reaction" on public.word_reactions for update to anon using (true) with check (true);
create policy "anyone can read reactions" on public.word_reactions for select to anon using (true);
create policy "anyone can count visits" on public.site_visits for select to anon using (true);
create policy "anyone can register visit" on public.site_visits for insert to anon with check (true);
create policy "anyone can update visit" on public.site_visits for update to anon using (true) with check (true);
alter publication supabase_realtime add table public.word_reactions;
alter publication supabase_realtime add table public.site_visits;
