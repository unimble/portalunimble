import { supaCli } from "../../utils/supaClient.ts";
import { response } from "../../utils/utils.ts";

export const addDado = async (conteudo) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Dado").insert(conteudo).select("*");

    if (error != null) return response(null, true, error.message, error.code);

    return response(data);
}

export const deleteDadoIn = async (ids) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Dado").delete().in("id", ids);

    if (error != null) return response(null, true, error.message, error.code);

    return response(data);
}

export const editDadoList = async (editList) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    for (const item of editList) {
        const { newData, where } = item;
        const { data, error } = await editById(newData, where);
        if (error != null) return response(null, true, error.message, error.code);
    }

    return true;
}

export const editById = async (content, id) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Dado").update({ Conteudo: content }).eq("id", id);

    if (error != null) return response(null, true, error.message, error.code);

    return true;
}