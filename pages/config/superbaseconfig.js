import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_RVSUPERBASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_RVSUPERBASE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or Key is missing!');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;