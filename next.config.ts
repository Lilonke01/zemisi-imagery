import type { NextConfig } from 'next';
const config: NextConfig = { images: { minimumCacheTTL: 1, localPatterns: [{ pathname: '/api/image' }, { pathname: '/hero.svg', search: '' }, { pathname: '/hero-portrait.png', search: '' }, { pathname: '/hero-evening.jpeg', search: '' }, { pathname: '/hero-lifestyle.jpeg', search: '' }], remotePatterns: [{ protocol: 'https', hostname: '**.supabase.co' }, { protocol: 'https', hostname: 'images.unsplash.com' }] } };
export default config;

