import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0';

let supaCli = null;

const supa = (auth: string = "") => {
    const url: string = Deno.env.get('SUPABASE_URL');
    const key: string = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    const options = auth
    ? {
        global: {
          headers: {
            apikey: key, // mantém a service key válida
            Authorization: `Bearer ${key}`,
            ...(auth && { "X-User-Token": auth }) // se quiser propagar o token do user
          }
        }
      }
    : {};

    try {
        supaCli = createClient(url, key, options);
    } catch (err) {
        return false;
    }
}


export { supa, supaCli };