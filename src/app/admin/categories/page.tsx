import { requireAdmin } from '@/lib/admin';
import { CategoriesManager } from '@/components/admin';
import type {Category} from '@/lib/types';
export default async function Categories(){const db=await requireAdmin();const {data,error}=await db.from('categories').select('*').order('display_order');if(error)throw error;return <CategoriesManager initial={data as Category[]}/>;}
