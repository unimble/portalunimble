import { supaCli } from "../../utils/supaClient.ts";
import { response } from "../../utils/utils.ts";

export const addItem = async (conteudo) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Item").insert([conteudo]).select("*");

    if (error != null) return response(null, true, error.message, error.code);

    return response(data[0]);
}

export const updateItemById = async (conteudo, id) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Item").update(conteudo).eq("id", id);

    if (error != null) return response(null, true, error.message, error.code);

    return true;
}

export const deleteItemById = async (id) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Item").delete().eq("id", id);

    if (error != null) return response(null, true, error.message, error.code);

    return response({});
}

export const getItensByItemBase = async (id) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Item").select("*").eq("item", id);

    if (error != null) return response(null, true, error.message, error.code);

    return data;
}

export const getItensByItemId = async (id) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Item").select("*").eq("id", id);

    if (error != null) return response(null, true, error.message, error.code);

    return data;
}

export const getItensByItemBaseByColaborador = async (id, colId) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Item").select("*").eq("item", id).eq("criador", colId);

    if (error != null) return response(null, true, error.message, error.code);

    return data;
}

export const getItensByColaborador = async (colId) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Item").select("*").eq("criador", colId);

    if (error != null) return response(null, true, error.message, error.code);

    return data;
}