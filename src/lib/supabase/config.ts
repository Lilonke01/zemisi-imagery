type PublicConfig = { url: string; key: string };
declare global { interface Window { __ZEMISI_SUPABASE__?: PublicConfig } }
// Only the publishable key is exposed. Runtime configuration avoids stale build-time values.
export function publicConfig(): PublicConfig {
  if (typeof window !== 'undefined' && window.__ZEMISI_SUPABASE__) return window.__ZEMISI_SUPABASE__;
  return { url: process.env.NEXT_PUBLIC_SUPABASE_URL || '', key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '' };
}
