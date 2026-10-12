import { redirect } from 'next/navigation';
import { serverDB } from './supabase/server';
// Route guards improve UX; RLS is the authority for every database/storage operation.
export async function requireAdmin(){if(!process.env.NEXT_PUBLIC_SUPABASE_URL)redirect('/login?setup=1');const db=await serverDB();const {data:{user}}=await db.auth.getUser();if(!user)redirect('/login');const {data:allowed,error}=await db.rpc('is_admin');if(error||!allowed)redirect('/?access=denied');return db;}
