import { supaCli } from "../../utils/supaClient.ts";
import { response } from "../../utils/utils.ts";

export const registerEquipe = async (name, colaboradorId, empresaId) => {
    const { data, error } = await supaCli.from("Equipe").insert([{ empresa: empresaId, nome:name, colaboradores:[colaboradorId], criador_equipe:colaboradorId }]).select("*");

    if (error != null) return false;

    return data;
}

export const associateEquipeToColaborador = async (colaboradorId, equipeId) => {
    const { data, error } = await supaCli.from("ColaboradorEquipes").insert([{ colaborador: colaboradorId, equipe:equipeId }]).select("*");

    if (error != null) return false;

    return data;
}

export const getEquipesByColaboradorId = async (col_id: string) => {
    const { data, error } = await supaCli.from("Equipe").select("*").eq("criador_equipe", col_id);

    if (error != null) return false;

    return data;
}