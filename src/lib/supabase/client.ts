import { createBrowserClient } from '@supabase/ssr';
import { publicConfig } from './config';
export function browserDB() { const {url,key}=publicConfig(); return createBrowserClient(url,key); }
