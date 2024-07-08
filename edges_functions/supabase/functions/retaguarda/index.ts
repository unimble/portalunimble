import { response, createResponse, router, folderName, corsHeaders } from "../utils/utils.ts";
import dict from "../config/dictionary.ts";

Deno.serve(async (req) => {
  const { url, method } = req

  if (method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const routerInvoked = router(method, url);
    if (!routerInvoked) throw new Error(dict.ROUTE_NOT_FOUND);

    let body = [];

    if (method === "POST" || method === "PUT") {
      body = await req.json();
    }

    const params = routerInvoked.params;
    const func_name = routerInvoked.function;
    const result = func_name(params, body);

    return createResponse({ error: false, message: "Ação realizada com sucesso", data: result });
  } catch (error) {
    return createResponse({ error: true, message: error.message }, error.status || 400)
  }
})