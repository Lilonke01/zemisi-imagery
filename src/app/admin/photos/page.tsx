import { requireAdmin } from '@/lib/admin';
import { PhotosManager } from '@/components/admin';
import type {Photo,Category} from '@/lib/types';
export default async function Photos(){const db=await requireAdmin();const [p,c]=await Promise.all([db.from('photos').select('*').order('display_order'),db.from('categories').select('*').order('display_order')]);if(p.error||c.error)throw new Error('Unable to load photos');return <PhotosManager initial={p.data as Photo[]} categories={c.data as Category[]}/>;}
