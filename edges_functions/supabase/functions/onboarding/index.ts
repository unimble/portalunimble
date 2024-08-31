import { response, createResponse, router, folderName, corsHeaders, verifyUserIntegrity } from "../utils/utils.ts";
import dict from "../config/dictionary.ts";

Deno.serve(async (req) => {
  const { url, method, headers } = req

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

    const { user, token } = await verifyUserIntegrity(headers);

    if (!user) throw new Error("Integridade do usuário não verificada");

    const params = routerInvoked.params;
    const func_name = routerInvoked.function;
    const { data, error, msg, code } = await func_name(params, body);

    if (error && code == "42501") throw new Error("Você não possui permissão para executar essa ação!");
    if (error) throw new Error(msg);

    return createResponse({ error: false, message: "Ação realizada com sucesso", data });
  } catch (error) {
    return createResponse({ error: true, message: error.message }, error.status || 400)
  }
})