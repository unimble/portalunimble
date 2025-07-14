import { supaCli } from "../../utils/supaClient.ts";
import { response } from "../../utils/utils.ts";

export const registerEquipe = async (name, colaboradorId, empresaId) => {
    const { data, error } = await supaCli.from("Equipe").insert([{ empresa: empresaId, nome: name, colaboradores: [colaboradorId], criador_equipe: colaboradorId }]).select("*");

    if (error != null) return false;

    return data;
}

export const updateEquipe = async (body, id) => {
    const { data, error } = await supaCli.from("Equipe").update(body).eq("id", id);

    if (error != null) return false;

    return true;
}

export const associateEquipeToColaborador = async (colaboradorId, equipeId) => {
    const { data, error } = await supaCli.from("ColaboradorEquipes").insert([{ colaborador: colaboradorId, equipe: equipeId }]).select("*");

    if (error != null) return false;

    return data;
}

export const getmembros = async (equipe) => {
    const { data, error } = await supaCli.from("ColaboradorEquipes").select(`
        id,
        colaborador(
            id,
            usuario (
                nome
            ),
            perfil (
                nome
            )
        ),
        equipe (
            id,
            nome,
            criador_equipe
        )
    `).eq("equipe", equipe);

    if (error != null) return false;

    return data;
}

export const getAllEquipes = async (col) => {
    const { data, error } = await supaCli.from("ColaboradorEquipes").select("*").eq("colaborador", col);

    if (error != null) return false;

    return data;
}

export const getAllAssociated = async (equipe) => {
    const { data, error } = await supaCli.from("ColaboradorEquipes").select("*").in("equipe", equipe);

    if (error != null) return false;

    return data;
}

export const verifyEquipe = async (col, equipe) => {
    const { data, error } = await supaCli.from("ColaboradorEquipes").select("*").eq("colaborador", col).eq("equipe", equipe);

    if (error != null) return false;

    return data;
}

export const getEquipesByColaboradorId = async (col_id: string) => {
    const { data, error } = await supaCli.from("Equipe").select("*").eq("criador_equipe", col_id);

    if (error != null) return false;

    return data;
}

export const getEquipesById = async (id: string) => {
    const { data, error } = await supaCli.from("Equipe").select("*").eq("id", id);

    if (error != null) return false;

    return data;
}

export const getEquipesByColaboradorIdAndName = async (col_id: string, name: string) => {
    const { data, error } = await supaCli.from("Equipe").select("*").eq("criador_equipe", col_id).eq("nome", name);

    if (error != null) return false;

    return data;
}

export const getEquipesColaboradorIsIn = async (col_id) => {
    const { data, error } = await supaCli.from("Equipe").select(`
        id,
        created_at,
        nome,
        empresa (
            id,
            nome
        ),
        colaboradores,
        criador_equipe (
            id,
            user_id
        )
    `).contains("colaboradores", col_id);

    if (error != null) return false;

    return data;
}

export const removeColaboradorFromAllEquipes = async (col_id) => {
    const { data, error } = await supaCli.from("ColaboradorEquipes").delete().eq("colaborador", col_id);

    if (error != null) return false;

    return data;
}

export const removeColaboradorFromOneEquipe = async (col_id, equipe_id) => {
    const { data, error } = await supaCli.from("ColaboradorEquipes").delete().eq("colaborador", col_id).eq("equipe", equipe_id);

    if (error != null) return false;

    return data;
}

export const removeAllColaboradorFromEquipe = async (equipe_id) => {
    const { data, error } = await supaCli.from("ColaboradorEquipes").delete().eq("equipe", equipe_id);

    if (error != null) return false;

    return data;
}

export const deleteEquipeById = async (id) => {
    const { data, error } = await supaCli.from("Equipe").delete().eq("id", id);

    if (error != null) return false;

    return data;
}