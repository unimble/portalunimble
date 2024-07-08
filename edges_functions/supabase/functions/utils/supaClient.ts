import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0';

let supaCli = null;

const supa = (auth: string = "") => {
    const url: string = "https://enrwqpgldrzrybbunzjz.supabase.co";
    const key: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucndxcGdsZHJ6cnliYnVuemp6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5ODEwOTY2MSwiZXhwIjoyMDEzNjg1NjYxfQ.9mDbjAladBm6p__R7CKJ0spnfdAEifBVUOxAzFKyx3M";

    const options = auth ? {
        global: {
            headers: {
                Authorization: `Bearer ${auth}`
            }
        }
    } : {};

    try {
        supaCli = createClient(url, key, options);
    } catch (err) {
        return false;
    }
}


export { supa, supaCli };