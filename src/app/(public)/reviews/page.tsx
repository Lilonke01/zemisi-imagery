import { Reviews } from '@/components/reviews';
import { publicReviews } from '@/lib/reviews';
import { publicData } from '@/lib/data';
export const metadata={title:'Reviews',description:'Client experiences and star ratings for Zemisi Imagery. Share your photography experience.'};
export default async function Page(){const [{reviews,ready},{settings}]=await Promise.all([publicReviews(),publicData()]);return <section className="section"><p className="eyebrow">WORDS FROM OUR CLIENTS</p><h1>Experiences worth sharing.</h1><Reviews reviews={reviews} ready={ready} businessName={settings.business_name}/></section>;}
