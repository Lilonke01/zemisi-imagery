import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validateReview } from '@/lib/review-validation';
export async function POST(request:Request){
 if(!process.env.NEXT_PUBLIC_SUPABASE_URL)return NextResponse.json({error:'Reviews are being set up. Please try again soon.'},{status:503});
 try{
  const body=await request.json();if(body?.website)return NextResponse.json({ok:true});
  const review=validateReview(body);if(!review)return NextResponse.json({error:'Enter your name, a review of 10–3000 characters and a rating of 1–5 stars.'},{status:400});
  // Anonymous client: the database enforces pending publication and prevents forged admin replies.
  const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{auth:{persistSession:false}});
  const {error}=await db.from('reviews').insert(review);
  if(error)return NextResponse.json({error:'Unable to submit your review. Please try again later.'},{status:503});
  return NextResponse.json({ok:true});
 }catch{return NextResponse.json({error:'Unable to submit your review. Please retry.'},{status:400});}
}
