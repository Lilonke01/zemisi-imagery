import { publicData } from '@/lib/data';
import { SiteShell } from '@/components/site-shell';
export const dynamic='force-dynamic';
export default async function Layout({children}:{children:React.ReactNode}) {const {settings}=await publicData();return <SiteShell settings={settings}>{children}</SiteShell>;}
