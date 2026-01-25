import { createClient } from '@supabase/supabase-js';
import { createMMKV } from 'react-native-mmkv';
import { Database } from './database.types';

const SUPABASE_PUBLISHED_KEY = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHED_KEY;
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;

// Separate MMKV instance for Supabase auth storage
const supabaseStorage = createMMKV({ id: 'supabase-auth' });

const supabaseStorageAdapter = {
  getItem: (key: string) => supabaseStorage.getString(key) ?? null,
  setItem: (key: string, value: string) => supabaseStorage.set(key, value),
  removeItem: (key: string) => {
    supabaseStorage.remove(key);
  },
};

export const supabase = createClient<Database>(SUPABASE_URL!, SUPABASE_PUBLISHED_KEY!, {
  auth: {
    storage: supabaseStorageAdapter,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
