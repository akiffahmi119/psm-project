// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Ensure your .env file has these variables:
// VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
// VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);