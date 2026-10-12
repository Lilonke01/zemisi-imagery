import { publicData } from '@/lib/data';
import { Gallery } from '@/components/gallery';
export const metadata={title:'The Gallery',description:'Explore published wedding, portrait, event and commercial photography by Zemisi Imagery.'};
export default async function GalleryPage(){const {settings,photos,categories}=await publicData();return <section className="section gallery-page"><p className="eyebrow">THE PORTFOLIO</p><h1>Little moments.<br/><em>Lasting stories.</em></h1><p>A collection of people, places and feelings, seen through our lens.</p><Gallery photos={photos} categories={categories} settings={settings}/></section>;}
