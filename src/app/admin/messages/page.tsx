import { requireAdmin } from '@/lib/admin';
import { Inbox } from '@/components/admin';
import type {Message} from '@/lib/types';
export default async function Messages(){const db=await requireAdmin();const {data,error}=await db.from('messages').select('*').order('created_at',{ascending:false});if(error)throw error;return <Inbox initial={data as Message[]}/>;}
