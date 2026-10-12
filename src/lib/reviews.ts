import { serverDB } from './supabase/server';
export type Review={id:string;name:string;experience:string;rating:number;is_published:boolean;admin_reply:string;admin_rating:number|null;created_at:string};
export function reviewsMissing(error:{code?:string}|null){return !!error&&['42P01','PGRST205'].includes(error.code||'');}
export async function publicReviews(){
 if(!process.env.NEXT_PUBLIC_SUPABASE_URL)return {reviews:[] as Review[],ready:false};
 const db=await serverDB();const {data,error}=await db.from('reviews').select('*').eq('is_published',true).order('created_at',{ascending:false}).limit(100);
 if(reviewsMissing(error))return {reviews:[] as Review[],ready:false};
 if(error)throw new Error('Unable to load reviews. Please retry.');
 return {reviews:data as Review[],ready:true};
}
