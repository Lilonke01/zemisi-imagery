import type { Story, Photo } from './types';
import { serverDB } from './supabase/server';

export function assembleStories(rows: Omit<Story, 'photos'>[], links: {story_id: string; photo_id: string; display_order: number}[], photos: Photo[]): Story[] {
 const byId = new Map(photos.map(p => [p.id, p]));
 return rows.map(s => ({...s, photos: links.filter(l => l.story_id === s.id).sort((a,b) => a.display_order-b.display_order).flatMap(l => byId.has(l.photo_id) ? [byId.get(l.photo_id)!] : [])}));
}
export function missingStories(error: {code?: string} | null) { return !!error && ['PGRST205','42P01'].includes(error.code || ''); }
export async function publicStories(photos: Photo[]): Promise<Story[]> {
 if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
 const db = await serverDB();
 const [s,l] = await Promise.all([db.from('stories').select('*').eq('is_published',true).order('display_order').order('created_at'), db.from('story_photos').select('*').order('display_order')]);
 // Older installations keep working until the additive migration has been applied.
 if (missingStories(s.error) || missingStories(l.error)) return [];
 if (s.error || l.error) throw new Error('Unable to load stories. Please retry.');
 return assembleStories(s.data,l.data,photos).filter(s => s.photos.length>0);
}
