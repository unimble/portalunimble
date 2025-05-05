import { supaCli } from "../../utils/supaClient.ts";
import { response } from "../../utils/utils.ts";

export const getByItemId = async (id) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("MetaEstrutura").select("*").eq("itemBase", id);

    if (error != null) return response(null, true, error.message, error.code);

    return data;
}

export const getByItemIdExpand = async (id) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("MetaEstrutura").select(`
        id,    
        itemDependente (
            id,
            nome
        ),
        dadoDependente (
            id,
            nomedodado,
            campohtml
        ),
        ordem
    `).eq("itemBase", id);

    if (error != null) return response(null, true, error.message, error.code);

    return data;
}

export const editMetaEstrutura = async (id, dados) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("MetaEstrutura").update(dados).eq("id", id).select("*");

    if (error != null) return response(null, true, error.message, error.code);

    return data[0];
}