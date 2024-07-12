import { supaCli } from "../../utils/supaClient.ts";
import { response } from "../../utils/utils.ts";

export const registerEquipe = async (name, colaboradorId, empresaId) => {
    const { data, error } = await supaCli.from("Equipe").insert([{ empresa: empresaId, nome:name, colaboradores:[colaboradorId], criador_equipe:colaboradorId }]).select("*");

    if (error != null) return false;

    return data;
}