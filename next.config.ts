import type { NextConfig } from 'next';
const config: NextConfig = { images: { minimumCacheTTL: 1, localPatterns: [{ pathname: '/api/image' }, { pathname: '/hero.svg', search: '' }], remotePatterns: [{ protocol: 'https', hostname: '**.supabase.co' }, { protocol: 'https', hostname: 'images.unsplash.com' }] } };
export default config;
