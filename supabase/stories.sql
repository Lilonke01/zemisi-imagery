-- Safe to run on an existing Zemisi database. Existing photos are preserved.
create table if not exists public.stories (
 id uuid primary key default gen_random_uuid(), title text not null check(length(trim(title)) between 1 and 200),
 caption text not null default '', category_id uuid references public.categories(id) on delete set null,
 is_published boolean not null default false, display_order integer not null default 0 check(display_order>=0),
 created_at timestamptz not null default now()
);
create table if not exists public.story_photos (
 story_id uuid not null references public.stories(id) on delete cascade,
 photo_id uuid not null references public.photos(id) on delete cascade,
 display_order integer not null default 0 check(display_order>=0), primary key(story_id,photo_id)
);
alter table public.stories enable row level security;
alter table public.story_photos enable row level security;
grant select on public.stories,public.story_photos to anon,authenticated;
grant insert,update,delete on public.stories,public.story_photos to authenticated;
drop policy if exists published_stories on public.stories;
create policy published_stories on public.stories for select to anon,authenticated using(is_published);
drop policy if exists admin_stories on public.stories;
create policy admin_stories on public.stories for all to authenticated using(public.is_admin()) with check(public.is_admin());
drop policy if exists published_story_photos on public.story_photos;
create policy published_story_photos on public.story_photos for select to anon,authenticated using(
 exists(select 1 from public.stories s where s.id=story_id and s.is_published)
 and exists(select 1 from public.photos p where p.id=photo_id and p.is_published)
);
drop policy if exists admin_story_photos on public.story_photos;
create policy admin_story_photos on public.story_photos for all to authenticated using(public.is_admin()) with check(public.is_admin());
-- Save the caption and ordered album together, so a failed save cannot leave a partial story.
create or replace function public.save_story(story_id uuid,story_title text,story_caption text,story_category uuid,story_published boolean,story_order integer,photo_ids uuid[])
returns uuid language plpgsql security invoker set search_path='' as $$
declare saved_id uuid; begin
 if not public.is_admin() then raise exception 'Admin required'; end if;
 if cardinality(photo_ids)=0 or photo_ids is null then raise exception 'Choose at least one photo'; end if;
 if cardinality(photo_ids)<>(select count(distinct x) from unnest(photo_ids) x) then raise exception 'Duplicate photos'; end if;
 if cardinality(photo_ids)<>(select count(*) from public.photos where id=any(photo_ids)) then raise exception 'A selected photo no longer exists'; end if;
 if story_published and exists(select 1 from public.photos where id=any(photo_ids) and not is_published) then
  raise exception 'Publish the selected photos in Photos before publishing this story';
 end if;
 if story_id is null then
  insert into public.stories(title,caption,category_id,is_published,display_order) values(story_title,story_caption,story_category,story_published,story_order) returning id into saved_id;
 else
  update public.stories set title=story_title,caption=story_caption,category_id=story_category,is_published=story_published,display_order=story_order where id=story_id returning id into saved_id;
  if saved_id is null then raise exception 'Story no longer exists'; end if;
 end if;
 delete from public.story_photos where story_photos.story_id=saved_id;
 insert into public.story_photos(story_id,photo_id,display_order) select saved_id,x.id,x.n-1 from unnest(photo_ids) with ordinality x(id,n);
 return saved_id;
end; $$;
revoke all on function public.save_story(uuid,text,text,uuid,boolean,integer,uuid[]) from public;
grant execute on function public.save_story(uuid,text,text,uuid,boolean,integer,uuid[]) to authenticated;
create index if not exists stories_order_idx on public.stories(is_published,display_order);
create index if not exists story_photos_photo_idx on public.story_photos(photo_id);
notify pgrst, 'reload schema';
