# Zemisi Imagery

Responsive Next.js App Router + TypeScript portfolio, Tailwind CSS 4, a shadcn/ui Button (Radix Slot), Supabase email/password authentication, Postgres and private Storage.

## Start locally

1. Install Node.js 22+ and run `npm install` (or `pnpm install`).
2. Copy `.env.example` to `.env.local`.
3. Create a Supabase project. In **SQL Editor**, run `supabase/schema.sql` once on a fresh project. This creates tables, seeds business settings and categories, enables RLS, and creates the private `portfolio` bucket with a 10MB limit.
4. From Supabase **Project Settings → API**, set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the project URL and its anon key. Never use a service-role key in these variables. Set `NEXT_PUBLIC_SITE_URL` to the website’s canonical origin.
5. In **Authentication → Users**, create the first admin email/password user, confirmed. Disable public signups in Auth settings if you do not need other accounts. Add its email to the server-controlled allowlist using SQL Editor:

   ```sql
   insert into public.admin_emails(email) values ('your-admin@example.com');
   ```

   Use a lowercase email. The browser cannot read or change this allowlist. The `is_admin()` function checks the current auth user against it; route guards and all database/storage write policies use that function.
6. Run `npm run dev` and open `http://localhost:3000`. Sign in at `/login`, then manage the studio at `/admin`.
7. Run `npm run typecheck` and `npm run build`; `npm start` serves the production build.

Without Supabase variables the public site renders an offline presentation with empty galleries. Login and contact submission clearly report setup is pending. No messages or uploads are simulated as successful.

## Business setup

In **Admin → Settings**, edit the WhatsApp number, display number, greeting, business details, about text, hero image and its alt text. The WhatsApp number is seeded as `27832321716` (South Africa +27, dropping the local leading zero), with display `083 232 1716`. Every public link reads these settings; contextual photo/package messages are URL encoded. Use digits only, including country code.

Set the real address, email and social links: these were not supplied and are initially blank. The map appears once an address is set. Hours initially say “By appointment”. Packages use “Request a quote” until you enter actual starting prices, for example “From R1 500”. Edit packages as a JSON array of `{ "name", "description", "price" }` objects. Testimonials are an array of `{ "name", "quote" }` objects; add only real, consented client quotes. No testimonials are fabricated.

The starter hero is an **illustrative Unsplash photograph**, not a claim of Zemisi’s work. Replace it before launch. Use a public hero URL from your Supabase project, or an allowed Unsplash URL. The hero must be publicly reachable (a separate public bucket can be used); the portfolio bucket is private. Add another approved image host to `next.config.ts` if needed. The page currently supports a hero image, not video.

## Studio tools

- Photos: multi-file picker or drop area, actual byte upload progress, JPEG/PNG/WebP validation up to 10MB. New photos are drafts. Edit titles, captions, category, alt text, featured/published flags and order. Select items to bulk publish/unpublish. Drag to reorder or use the accessible earlier arrow. Search titles and filter categories. Delete removes the storage object and row.
- Categories: create, rename, delete, drag reorder or move earlier. Deleting a category keeps its photos and clears their category.
- Messages: read incoming contact submissions, mark read, delete. The dashboard counts unread messages.
- Settings: database-backed business configuration and services/testimonials.

The gallery uses responsive Next Image sizes and lazy loading, with priority loading only for the hero. The native dialog traps focus, Escape closes, arrow keys navigate, and focus returns to the opener. Lightbox photo links support `?photo=<uuid>` and contextual WhatsApp booking. Light/dark preference is stored locally; initial default is light. Motion respects reduced-motion settings.

## Data and security

Public visitors can read published photos, categories and settings, and insert validated unread contact messages. They cannot read messages, drafts or the admin allowlist. Admins can manage all content. Storage is **private**: public downloads require a matching published photo through RLS; admins can view drafts with signed URLs. The public `/api/image` route downloads using only the anon key, preserving RLS. No service-role bypass exists. Signed admin preview URLs expire in one hour.

Server reads use `force-dynamic`, so edits are visible on the next page request without a redeploy. Already-open public pages update when refreshed; there is no realtime subscription. Next Image may temporarily retain a cached image after unpublication; storage and database access are immediately denied. For strict takedown of cached images, purge the deployment’s image cache.

Contact forms validate on both client and server and include a honeypot. For a public launch, configure host-level rate limiting or CAPTCHA if spam protection is needed; Supabase permits direct anon inserts by the requested RLS design. Never store secrets in the repository. Restrict Supabase Auth redirect URLs to the deployed origin and localhost for development.

## Deploy

Deploy this folder as a **Next.js application** on Vercel or another compatible Node.js host. Add the three environment variables there, build with `npm run build`, and set the canonical URL before building. Supabase keys/project are external configuration and are not supplied in this deliverable. No production deployment has been made.

SEO includes page metadata, Open Graph title/description, Twitter summary card, `/sitemap.xml`, `/robots.txt`, and admin no-index. Add a real Open Graph image in `src/app/layout.tsx` before marketing the site.

## Structure

```text
src/app/(public)/           Home, gallery, contact and shared public shell
src/app/admin/              Protected dashboard and managers
src/app/login/              Email/password sign-in
src/app/api/contact/        Validated contact insertion
src/app/api/image/          RLS-controlled private storage downloads
src/app/globals.css         Responsive visual system, themes and motion
src/app/sitemap.ts          Public sitemap
src/app/robots.ts           Crawler rules
src/components/admin.tsx   Interactive studio managers
src/components/gallery.tsx Filters, native lightbox and photo deep links
src/components/ui/button.tsx  shadcn/ui Button primitive
src/lib/                   Supabase clients, data, types and settings
src/proxy.ts               Supabase auth-cookie refresh
supabase/schema.sql        Tables, seed, bucket, RLS and atomic reorder RPCs
```

Security behavior should be checked against your configured Supabase project: anonymous published reads and message inserts succeed; anonymous draft/message reads and writes fail; a nonallowlisted authenticated user is denied studio access and writes; an allowlisted user can upload/manage content; unpublishing denies the original storage download. Use a separate staging project for destructive checks.
## Story albums

For an existing installation, run `supabase/stories.sql` in Supabase SQL Editor once.
For a new installation, run `supabase/schema.sql` first, then `supabase/stories.sql`.

1. Open **Admin → Photos** to upload and publish the pictures.
2. Open **Admin → Stories → Create story**.
3. Add a title and story caption, choose a category, and select pictures from your collection.
4. Use the arrows in **Pictures in this story** to set the sequence. The first picture is the cover.
5. Tick **Publish this story on the home page**, then **Save story**.

Visitors can open each story and swipe through its pictures, use previous/next buttons,
or use arrow keys. The story title and caption remain visible as they browse.
Escape closes the album. Only published stories and published photos are public.
Deleting a story keeps its original photos. A photo can belong to multiple stories.
Until the first story is published, the home page keeps showing existing featured photos.

## Client reviews
Run supabase/reviews.sql in Supabase SQL Editor once to enable the reviews section.
Clients can submit their name, experience and a 1–5 star rating on the home page or /reviews.
Submissions stay pending until an admin approves them in Admin → Reviews.
Admins can publish/hide reviews, delete them, and write a studio reply with an optional
separate star rating. The average score is calculated from client ratings only.
Public users cannot publish reviews, change ratings, or forge studio responses.
