import { requireAdmin } from '@/lib/admin';
import { StoriesManager } from '@/components/stories-admin';
import { assembleStories, missingStories } from '@/lib/stories';
import type { Category, Photo } from '@/lib/types';
export const metadata={title:'Manage Stories'};
export default async function StoriesPage(){
 const db=await requireAdmin();
 const [s,l,p,c]=await Promise.all([db.from('stories').select('*').order('display_order'),db.from('story_photos').select('*').order('display_order'),db.from('photos').select('*').order('display_order'),db.from('categories').select('*').order('display_order')]);
 if(missingStories(s.error)||missingStories(l.error))return <><h1>Stories.</h1><div className="empty"><h3>Enable story albums</h3><p>Run the supplied supabase/stories.sql file in your Supabase SQL Editor, then refresh this page. Your existing photos will be preserved.</p></div></>;
 if(s.error||l.error||p.error||c.error)throw new Error('Unable to load story albums. Please retry.');
 return <StoriesManager initial={assembleStories(s.data,l.data,p.data)} photos={p.data as Photo[]} categories={c.data as Category[]}/>;
}
