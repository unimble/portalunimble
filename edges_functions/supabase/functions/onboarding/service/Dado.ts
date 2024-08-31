import { response, isNumber } from "../../utils/utils.ts";

export const addDado = async (data) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Dado").insert(data).select("*");

    if (error != null) return response(null, true, error.message, error.code);

    return response(data);
}