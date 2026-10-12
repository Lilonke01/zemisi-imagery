import { Brand } from '@/components/brand';

import { requireAdmin } from '@/lib/admin';
import { SignOut } from '@/components/admin';
export const dynamic='force-dynamic';
export const metadata={title:'Studio Admin',robots:{index:false,follow:false}};
export default async function AdminLayout({children}:{children:React.ReactNode}){await requireAdmin();return <div className="admin-shell"><aside><a href="/" aria-label="Zemisi Imagery home"><Brand subtitle="STUDIO ADMINISTRATION"/></a><nav aria-label="Studio navigation">{[['','Dashboard'],['/photos','Photos'],['/stories','Stories'],['/categories','Categories'],['/messages','Messages'],['/settings','Settings']].map(([path,name])=><a key={path} href={'/admin'+path}>{name}</a>)}</nav><a href="/">View website ↗</a><SignOut/></aside><main id="main" className="admin-main">{children}</main></div>;}


