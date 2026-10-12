import { requireAdmin } from '@/lib/admin';
import { reviewsMissing } from '@/lib/reviews';
import { ReviewsManager } from '@/components/reviews-admin';
export const metadata={title:'Manage Reviews'};
export default async function Page(){const db=await requireAdmin();const {data,error}=await db.from('reviews').select('*').order('created_at',{ascending:false});if(reviewsMissing(error))return <><h1>Reviews.</h1><div className="empty"><h3>Enable reviews</h3><p>Run supabase/reviews.sql in your Supabase SQL Editor, then refresh this page. Existing photos and stories are preserved.</p></div></>;if(error)throw new Error('Unable to load reviews');return <ReviewsManager initial={data}/>;}
