import { supaCli } from "../../utils/supaClient.ts";
import { response } from "../../utils/utils.ts";

export const addMetaInstancia = async (body) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("MetaInstancia").insert(body).select("*");

    if (error != null) return response(null, true, error.message, error.code);

    return data;
}

export const deleteMetaInstanciaIn = async (ids) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("MetaInstancia").delete().in("id", ids);

    if (error != null) return response(null, true, error.message, error.code);

    return data;
}

export const getMetaInstanciaByIds = async (ids) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("MetaInstancia").select("*").in("id", ids);

    if (error != null) return response(null, true, error.message, error.code);

    return data;
}

export const getMetaInstanciaByIdsExpand = async (ids) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("MetaInstancia").select(`
        id,
        created_at,
        dado (
            id,
            Conteudo,
            TipoDeDado (
                id,
                nomedodado,
                campohtml
            )
        ),
        metaEstrutura (
            id,
            itemBase,
            itemDependente,
            dadoDependente,
            ordem
        )
    `).in("id", ids);

    if (error != null) return response(null, true, error.message, error.code);

    return data;
}