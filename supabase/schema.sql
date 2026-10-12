-- Run once in Supabase SQL Editor. No service-role key is required by the website.
create table public.admin_emails (email text primary key check (email = lower(email)));
alter table public.admin_emails enable row level security;
revoke all on public.admin_emails from anon, authenticated;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admin_emails a join auth.users u on lower(u.email)=a.email where u.id=auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;
create table public.categories (id uuid primary key default gen_random_uuid(), name text not null check(length(name)>0), slug text not null unique check(length(slug)>0), display_order integer not null default 0 check(display_order>=0));
create table public.photos (id uuid primary key default gen_random_uuid(), title text not null, caption text not null default '', alt_text text not null, category_id uuid references public.categories(id) on delete set null, image_url text not null, storage_path text not null unique, is_featured boolean not null default false, is_published boolean not null default false, display_order integer not null default 0 check(display_order>=0), created_at timestamptz not null default now());
create index photos_order_idx on public.photos(is_published,display_order);
create table public.messages (id uuid primary key default gen_random_uuid(),name text not null check(length(trim(name)) between 1 and 120),email text not null check(length(email)<=254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),message text not null check(length(trim(message)) between 10 and 5000),is_read boolean not null default false,created_at timestamptz not null default now());
create table public.site_settings (id integer primary key default 1 check(id=1),business_name text not null,tagline text not null default 'Your moments. Beautifully remembered.',about_text text not null default 'Photography that feels like you. From the quiet in-between moments to the celebrations you never want to forget, we create imagery with warmth, intention and a timeless perspective.',whatsapp_number text not null check(whatsapp_number ~ '^[1-9][0-9]{7,14}$'),whatsapp_display text not null,default_whatsapp_message text not null,email text not null default '',phone text not null default '083 232 1716',address text not null default '',business_hours text not null default 'By appointment',instagram_url text not null default '',facebook_url text not null default '',hero_image text not null default '',hero_alt text not null default 'Zemisi Imagery featured photograph',packages jsonb not null default '[]',testimonials jsonb not null default '[]');
insert into public.site_settings (business_name,whatsapp_number,whatsapp_display,default_whatsapp_message,hero_image,hero_alt,packages) values ('Zemisi Imagery','27832321716','083 232 1716','Hi Zemisi Imagery! I saw your website and I''d like to know more about your photography services.','https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2200&q=85','Illustrative wedding photography: a couple celebrating together','[{"name":"Weddings","description":"Every promise. Every happy tear.","price":"Request a quote"},{"name":"Portraits","description":"A little of your soul, in every frame.","price":"Request a quote"},{"name":"Events","description":"The atmosphere. The people. The story.","price":"Request a quote"},{"name":"Product","description":"Thoughtful imagery for your brand.","price":"Request a quote"}]');
insert into public.categories(name,slug,display_order) values ('Weddings','weddings',0),('Portraits','portraits',1),('Events','events',2),('Corporate','corporate',3),('Product','product',4);
alter table public.photos enable row level security;
alter table public.categories enable row level security;
alter table public.messages enable row level security;
alter table public.site_settings enable row level security;
grant select on public.photos,public.categories,public.site_settings to anon,authenticated;
grant insert on public.messages to anon,authenticated;
grant select,insert,update,delete on public.photos,public.categories,public.messages,public.site_settings to authenticated;
create policy published_photos on public.photos for select to anon,authenticated using(is_published);
create policy public_categories on public.categories for select to anon,authenticated using(true);
create policy public_settings on public.site_settings for select to anon,authenticated using(true);
create policy contact_insert on public.messages for insert to anon,authenticated with check(is_read=false);
create policy admin_photos on public.photos for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy admin_categories on public.categories for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy admin_messages on public.messages for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy admin_settings on public.site_settings for all to authenticated using(public.is_admin()) with check(public.is_admin());
-- Keep the singleton row; admins edit it, never delete it.
create function public.keep_settings() returns trigger language plpgsql set search_path='' as $$ begin raise exception 'Settings cannot be deleted'; end; $$;
create trigger keep_settings before delete on public.site_settings for each row execute function public.keep_settings();
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('portfolio','portfolio',false,10485760,array['image/jpeg','image/png','image/webp']);
create policy portfolio_published_read on storage.objects for select to anon,authenticated using(bucket_id='portfolio' and exists(select 1 from public.photos where storage_path=name and is_published));
create policy portfolio_admin on storage.objects for all to authenticated using(bucket_id='portfolio' and public.is_admin()) with check(bucket_id='portfolio' and public.is_admin());
-- Atomic ordering and publication operations execute as the caller and retain RLS.
create function public.reorder_items(target_table text,item_ids uuid[]) returns void language plpgsql security invoker set search_path='' as $$
begin
 if not public.is_admin() then raise exception 'Admin required'; end if;
 if target_table not in ('photos','categories') then raise exception 'Invalid table'; end if;
 execute format('update public.%I t set display_order=o.n-1 from unnest($1) with ordinality as o(id,n) where t.id=o.id',target_table) using item_ids;
end; $$;
create function public.set_photo_publication(photo_ids uuid[],publish boolean) returns void language plpgsql security invoker set search_path='' as $$ begin
 if not public.is_admin() then raise exception 'Admin required'; end if;
 update public.photos set is_published=publish where id=any(photo_ids);
end; $$;
revoke all on function public.reorder_items(text,uuid[]),public.set_photo_publication(uuid[],boolean) from public;
grant execute on function public.reorder_items(text,uuid[]),public.set_photo_publication(uuid[],boolean) to authenticated;
