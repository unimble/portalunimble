import { createClient } from '@supabase/supabase-js';

const apiKey = import.meta.env.VITE_SUPA_KEY;
const apiUrl = import.meta.env.VITE_SUPA_URL;

const supa = createClient(apiUrl, apiKey);

export default supa;