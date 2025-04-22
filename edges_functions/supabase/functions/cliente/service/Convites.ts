import { supaCli } from "../../utils/supaClient.ts";
import { response } from "../../utils/utils.ts";

export const addConvite = async (conteudo) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Convites").insert(conteudo).select("*");

    if (error != null) return response(null, true, error.message, error.code);

    return response(data);
}

export const getConviteByEmail = async (email) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Convites").select("*").eq("email", email);
    if (error != null) return response(null, true, error.message, error.code);

    return response(data);
}

export const getConviteByEquipe = async (equipe) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Convites").select("*").eq("equipe", equipe);
    if (error != null) return response(null, true, error.message, error.code);

    return response(data);
}

export const removeByEmail = async (email) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { error } = await supaCli.from("Convites").delete().eq("email", email);
    if (error != null) return response(null, true, error.message, error.code);

    return true;
}