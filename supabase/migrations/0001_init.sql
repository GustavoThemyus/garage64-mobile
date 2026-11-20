-- Garage64: catálogo e builds. Rodar uma vez no SQL Editor do Supabase.

create table if not exists public.cars (
  id integer primary key,
  data jsonb not null
);

alter table public.cars enable row level security;

drop policy if exists "cars are readable by everyone" on public.cars;
create policy "cars are readable by everyone"
  on public.cars for select using (true);

-- O catálogo é escrito só pelo seed (role postgres, que ignora o RLS). Não há policy de insert nem update.

-- id é texto porque o app gera o id da build (src/storage/buildFromDraft.ts). A chave inclui o dono
-- pra um id repetido entre usuários nunca colidir.
create table if not exists public.builds (
  id text not null,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  car_id integer not null references public.cars(id),
  name text not null,
  config jsonb not null,
  computed jsonb not null,
  warnings jsonb not null default '[]',
  created_at timestamptz not null default now(),
  primary key (user_id, id)
);

alter table public.builds enable row level security;

drop policy if exists "users manage their own builds" on public.builds;
create policy "users manage their own builds"
  on public.builds for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
