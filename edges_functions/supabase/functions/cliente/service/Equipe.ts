import { supaCli } from "../../utils/supaClient.ts";
import { response, getNanoId } from "../../utils/utils.ts";

export const registerEquipe = async (name, colaboradorId, empresaId) => {
    const { data, error } = await supaCli.from("Equipe").insert([{ empresa: empresaId, nome: name, colaboradores: [colaboradorId], criador_equipe: colaboradorId, mnemonico:getNanoId() }]).select("*");

    if (error != null) return false;

    return data;
}

export const updateEquipe = async (body, id) => {
    const { data, error } = await supaCli.from("Equipe").update(body).eq("id", id);

    if (error != null) return false;

    return true;
}

export const updateEquipeMember = async (memberId, equipeId) => {
    const equipeData = await supaCli.from("Equipe").select("*").eq("id", equipeId);

    const novosIds = [...(equipeData.data[0].colaboradores || []), memberId];

    const { data, error } = await supaCli.from("Equipe").update({colaboradores: novosIds}).eq("id", equipeId);

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

export const getAll = async () => {
    const { data, error } = await supaCli.from("Equipe").select("*");

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

export const verifyEquipeByUrlId = async (col, equipe) => {
    const { data, error } = await supaCli.from("ColaboradorEquipes").select(`
        id,
        colaborador,
        equipe (
            id,
            mnemonico
        ) 
    `).eq("colaborador", col).eq("equipe.mnemonico", equipe);

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

export const getEquipesByUrlId = async (nanoid: string) => {
    const { data, error } = await supaCli.from("Equipe").select("*").eq("mnemonico", nanoid);

    if (error != null) return false;

    return data;
}

export const getEquipesByColaboradorIdAndName = async (col_id: string, name: string) => {
    const { data, error } = await supaCli.from("Equipe").select("*").eq("criador_equipe", col_id).eq("nome", name);

    if (error != null) return false;

    return data;
}

export const getEquipesColaboradorIsIn = async (col_id, pag = null) => {
    let query = supaCli
        .from("Equipe")
        .select(`
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
            ),
            mnemonico
        `)
        .contains("colaboradores", col_id).order('nome', { ascending: false });

    if (pag?.offset != null && pag?.perPage != null) {
        const start = (pag.offset) * pag.perPage;
        const end = start + pag.perPage - 1;

        query = query.range(start, end);
    }

    const { data, error } = await query;

    return error ? false : data;
};

export const getEquipesColaboradorIsInTotal = async (col_id) => {
    let query = supaCli
        .from("Equipe")
        .select(`id`, { count: "exact" })
        .contains("colaboradores", col_id);

    const { count, error } = await query;

    return count;
};

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