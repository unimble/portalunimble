import { supaCli } from "../../utils/supaClient.ts";
import { response } from "../../utils/utils.ts";

export const registerEmpresa = async (name, colaboradorId) => {
    const { data, error } = await supaCli.from("Empresa").insert([{ nome: name, usuario_criador: colaboradorId }]).select("*");

    if (error != null) return false;

    return data[0];
}