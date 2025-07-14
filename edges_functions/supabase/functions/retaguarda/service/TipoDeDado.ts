import { supaCli } from "../../utils/supaClient.ts";
import { response } from "../../utils/utils.ts";

export const addTipoDado = async (name, html) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");
    
    const { data, error } = await supaCli.from("TipoDeDado").insert([{ nomedodado: name, campohtml: html }]).select("*");

    if (error != null) return response(null, true, error.message, error.code);

    return response(data[0]);
}

export const getTipoDeDadoByName = async (name) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");
    
    const { data, error } = await supaCli.from("TipoDeDado").select("*").eq("nomedodado", name);

    if (error != null) return response(null, true, error.message, error.code);

    return response(data[0]);
}

export const getTipoDeDadoByNameIn = async (name) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");
    
    const { data, error } = await supaCli.from("TipoDeDado").select("*").in("nomedodado", name);

    if (error != null) return response(null, true, error.message, error.code);

    return response(data);
}

export const deleteDadoById = async (id) => {
    const { data, error } = await supaCli.from("TipoDeDado").delete().eq("id", id);

    if (error != null) return response(null, true, error.message, error.code);

    return response({});
}