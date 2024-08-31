import { supaCli } from "../../utils/supaClient.ts";
import { response } from "../../utils/utils.ts";

export const registerEmpresa = async (name, colaboradorId) => {
    const { data, error } = await supaCli.from("Empresa").insert([{ nome: name, usuario_criador: colaboradorId }]).select("*");

    if (error != null) return false;

    return data[0];
}

export const editEmpresaByColId = async (content, colId) => {
    const { data, error } = await supaCli.from("Empresa").update(content).eq("usuario_criador", colId);

    if (error != null) return false;

    return true;
}

export const getEmpresaByColaboradorId = async (col_id: string) => {
    const { data, error } = await supaCli.from("Empresa").select("*").eq("usuario_criador", col_id);

    if (error != null) return false;

    return data;
}