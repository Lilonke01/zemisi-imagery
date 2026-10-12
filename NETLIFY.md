# Hosting Zemisi Imagery on Netlify

This Next.js edition includes the latest login, admin navigation and upload fixes. Use this folder, not the Sites/Vinext `zemisi-hosted` edition.

1. Extract `zemisi-imagery.zip` and upload the contents of the `zemisi-imagery` folder to a GitHub repository. `package.json` and `netlify.toml` should be at the repository root. Do not upload `node_modules`, `.next`, or `.env.local`.
2. Sign in to Netlify. Choose **Add new project → Import an existing project → GitHub**, then select your repository.
3. Netlify should detect Next.js. The included configuration sets Node 22, build command `pnpm run build`, and publish directory `.next`. Netlify automatically applies its Next.js adapter. This is a server-rendered app, so a source ZIP dropped into the static drag-and-drop deploy area is not sufficient.
4. Before deployment, add these variables under **Project configuration → Environment variables**, available to builds and functions:

   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://cfecnwmhqxctsljdorzv.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your existing `sb_publishable_…` key |
   | `NEXT_PUBLIC_SITE_URL` | Your Netlify HTTPS origin, such as `https://zemisi-imagery.netlify.app` |

   Use the actual address Netlify assigns. No service-role or secret key is needed.
5. Deploy. If you added variables after the first build, trigger a fresh deployment so the browser bundle receives them.
6. In Supabase **Authentication → URL Configuration**, set Site URL to your new Netlify origin and add that origin to allowed redirect URLs. Keep the existing ChatGPT Site origin allowed if you still use it.
7. Open `/login`, sign in with your existing admin account, and check `/admin/photos`, `/gallery`, and a photo lightbox. The same Supabase project retains all photos, captions, categories, messages and settings. You do not need to rerun the schema or reupload images.

For a custom domain, add it in Netlify's domain settings and update both `NEXT_PUBLIC_SITE_URL` and the Supabase URL settings. Rebuild after changing the environment variable.

Official references: https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/ and https://docs.netlify.com/build/environment-variables/get-started/.
