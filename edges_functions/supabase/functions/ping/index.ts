import { corsHeaders } from "../utils/utils.ts";

Deno.serve(async (req) => {
  return new Response('ok', { headers: corsHeaders });
})