import { supaCli, supa } from "./supaClient.ts";
import routes from "./routes.ts";

export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, Content-Type, apikey, X-Client-Info',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

export function createResponse(body: any, status = 200, headers = {}) {
    return new Response(JSON.stringify(body), {
        headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            ...headers,
        },
        status: status,
    });
}
//Auth
export const verifyUserIntegrity = async (headers) => {
    const token = getAuth(headers);
    supa(token);

    if (!token) return false;

    const { data, error } = await supaCli.auth.getUser(token);

    if (error != null) return false;

    return { user: data.user, token };
}
export const getAuth = (headers) => {
    let jwt = Object.fromEntries(headers).authorization;
    jwt = jwt.split(" ");

    if (jwt[0] != "Bearer") return false;
    jwt = jwt[1];

    return jwt;
}
//Router
export const router = (method, url) => {
    const cleanedUrl = getCleanUrl(url);
    const methodInvoked = routes[method.toLowerCase()];

    if (!(Array.isArray(methodInvoked) && methodInvoked.length > 0)) return false;

    for (const item of methodInvoked) {
        // Cria um padrão para a URL usando expressões regulares
        const pattern = item.route
            .replace(/:[a-z0-9]+/gi, '([a-z0-9-]+)')  // Substitui parâmetros da URL por expressões regulares
            .replace(/\//g, '\\/');  // Escapa as barras na URL

        const regex = new RegExp(`^${pattern}$`, 'i');  // Cria uma expressão regular para a URL

        const match = cleanedUrl.match(regex);  // Testa a URL contra o padrão

        if (match) {
            // Extrai os parâmetros da URL se existirem
            const params = {};
            const keys = (item.route.match(/:[a-z0-9]+/gi) || []).map(param => param.substring(1));  // Extrai os nomes dos parâmetros
            keys.forEach((key, index) => {
                params[key] = match[index + 1];
            });

            // Retorna a função associada à rota e os parâmetros
            return {
                function: item.function,
                params
            };
        }
    }

    return false;
}
//Helpers
export const getCleanUrl = (url) => {
    const cleanUrl = url.split('/').slice(4);

    return "/" + cleanUrl.join('/');
}
export const isNumber = (target) => {
    const expression = /^\d$/;

    return expression.test(target);
}

export const response = (data = null, error = false, msg = "Ops ocorreu um erro inesperado!", code = "") => {
    return { error, msg, code, data };
}