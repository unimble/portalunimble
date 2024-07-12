import { supaCli } from "../../utils/supaClient.ts";
import { response } from "../../utils/utils.ts";

export const addTipoDado = async (name, html) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");
    
    const { data, error } = await supaCli.from("TipoDeDado").insert([{ nomedodado: name, campohtml: html }]).select("*");

    if (error != null) return response(null, true, error.message, error.code);

    return response(data[0]);
}