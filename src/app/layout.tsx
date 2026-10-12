import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000'), title:{default:'Zemisi Imagery — Photography Portfolio',template:'%s | Zemisi Imagery'},description:'Photography with warmth and intention. Explore Zemisi Imagery’s portfolio and book weddings, portraits, events and product photography.',openGraph:{title:'Zemisi Imagery — Photography Portfolio',description:'Your moments. Beautifully remembered.',type:'website'},twitter:{card:'summary_large_image'}};
export const dynamic = 'force-dynamic';
export default function RootLayout({children}:{children:React.ReactNode}) {
 const config = JSON.stringify({ url: process.env.NEXT_PUBLIC_SUPABASE_URL || '', key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '' }).replace(/</g,'\\u003c');
 return <html lang="en" suppressHydrationWarning><body><script dangerouslySetInnerHTML={{__html:`window.__ZEMISI_SUPABASE__=${config};`}}/>{children}</body></html>;
}
