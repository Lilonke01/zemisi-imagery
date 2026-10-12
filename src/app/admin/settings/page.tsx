import { requireAdmin } from '@/lib/admin';
import { SettingsEditor } from '@/components/admin';
import type {Settings} from '@/lib/types';
export default async function SettingsPage(){const db=await requireAdmin();const {data,error}=await db.from('site_settings').select('*').eq('id',1).single();if(error)throw error;return <SettingsEditor initial={data as Settings}/>;}
