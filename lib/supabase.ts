import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 型定義
export interface User {
  id: string
  username: string
  bio: string | null
  avatar_url: string | null
  created_at: string
}

export interface Post {
  id: number
  user_id: string
  content: string
  image_url: string | null
  created_at: string
}
