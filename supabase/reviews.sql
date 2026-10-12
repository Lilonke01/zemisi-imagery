-- Run in Supabase SQL Editor. Existing photos, stories and settings are preserved.
create table if not exists public.reviews (
 id uuid primary key default gen_random_uuid(),
 name text not null check(length(trim(name)) between 1 and 120),
 experience text not null check(length(trim(experience)) between 10 and 3000),
 rating integer not null check(rating between 1 and 5),
 is_published boolean not null default false,
 admin_reply text not null default '' check(length(admin_reply)<=3000),
 admin_rating integer check(admin_rating between 1 and 5),
 created_at timestamptz not null default now()
);
alter table public.reviews enable row level security;
grant select on public.reviews to anon,authenticated;
grant insert(name,experience,rating) on public.reviews to anon,authenticated;
grant insert,update,delete on public.reviews to authenticated;
drop policy if exists published_reviews on public.reviews;
create policy published_reviews on public.reviews for select to anon,authenticated using(is_published);
drop policy if exists submit_review on public.reviews;
create policy submit_review on public.reviews for insert to anon,authenticated
 with check(is_published=false and admin_reply='' and admin_rating is null);
drop policy if exists admin_reviews on public.reviews;
create policy admin_reviews on public.reviews for all to authenticated
 using(public.is_admin()) with check(public.is_admin());
create index if not exists reviews_public_idx on public.reviews(is_published,created_at desc);
notify pgrst,'reload schema';
