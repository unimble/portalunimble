import { supaCli } from "../../utils/supaClient.ts";
import { response } from "../../utils/utils.ts";

import { deletePermitionByCol } from "./Permissao.ts";
import { removeByEmail } from "./Convites.ts";
import { editEmpresaByColId } from "./Empresa.ts";
import { removeColaboradorFromAllEquipes, getEquipesByColaboradorId, deleteEquipeById, updateEquipe } from "./Equipe.ts";

import { deleteMetadadoAll } from "../../retaguarda/service/MetaDados.ts";
import { getItensIdsByColaborador } from "../../retaguarda/service/Item.ts";



export const registerColaborador = async (body) => {
    const { data, error } = await supaCli.from("Colaborador").insert([body]).select("*");

    if (error != null) return false;

    return data[0];
}

export const getColaboradorByUserId = async (user_id: string) => {
    const { data, error } = await supaCli.from("Colaborador").select("*").eq("user_id", user_id);

    if (error != null) return false;

    return data[0];
}

export const getColaboradorByUsuario = async (user_id: string) => {
    const { data, error } = await supaCli.from("Colaborador").select("*").eq("usuario", user_id);

    if (error != null) return false;

    return data[0];
}

export const getColaboradorById = async (id: string) => {
    const { data, error } = await supaCli.from("Colaborador").select("*").eq("id", id);

    if (error != null) return false;

    return data[0];
}

export const getColaboradorByUserIdExpand = async (user_id: string) => {
    const { data, error } = await supaCli.from("Colaborador").select(`
        id,
        usuario (
            id,
            nome,
            email,
            empresas,
            googleid,
            profile
        ),
        perfil (
            id,
            created_at,
            nome,
            padrao
        ),
        empresa,
        user_id,
        created_at   
    `).eq("user_id", user_id);

    if (error != null) return false;

    return data[0];
}

export const getColaboradorByIdExpand = async (id: string) => {
    const { data, error } = await supaCli.from("Colaborador").select(`
        id,
        usuario (
            id,
            nome,
            email,
            empresas,
            googleid,
            profile
        ),
        perfil (
            id,
            created_at,
            nome,
            padrao
        ),
        empresa,
        user_id,
        created_at   
    `).eq("id", id);

    if (error != null) return false;

    return data[0];
}

export const getColaboradorByUserIdExpandIn = async (array) => {
    const { data, error } = await supaCli.from("Colaborador").select(`
        id,
        usuario (
            id,
            nome,
            email,
            empresas,
            googleid,
            profile
        ),
        perfil (
            id,
            created_at,
            nome,
            padrao
        ),
        user_id,
        created_at   
    `).in("id", array);

    if (error != null) return false;

    return data;
}

export const editColaboradorPerfil = async (user_id: string, perfilId: string) => {
    const { data, error } = await supaCli.from("Colaborador").update({ perfil: perfilId }).eq("user_id", user_id);

    if (error != null) return response(null, true, error.message, error.code);

    return true;
}

export const editById = async (body, id) => {
    const { data, error } = await supaCli.from("Colaborador").update(body).eq("id", id);

    if (error != null) return response(null, true, error.message, error.code);

    return true;
}

export const editEmpresa = async (user_id: string, empresa: string) => {
    const { data, error } = await supaCli.from("Colaborador").update({ empresa }).eq("user_id", user_id);

    if (error != null) return response(null, true, error.message, error.code);

    return true;
}

export const editColaboradorPlanejamento = async (user_id: string, planejamentoDone: boolean) => {
    const { data, error } = await supaCli.from("Colaborador").update({ planejamentoDone }).eq("user_id", user_id);

    if (error != null) return response(null, true, error.message, error.code);

    return true;
}

export const deleteColaboradorById = async (colId) => {
    const col = await getColaboradorByIdExpand(colId);
    const allMyItens = await getItensIdsByColaborador(colId);

    if (allMyItens?.length > 0) {
        let ids = allMyItens.map(item => item.id);

        // deleting all user metadados
        await deleteMetadadoAll(ids, colId);
    }

    // deleting relation with permission
    await removeByEmail(col.usuario.email);
    await removeColaboradorFromAllEquipes(colId);

    //removing user from equipes
    const equipes = await getEquipesByColaboradorId(colId);

    for (const eq of equipes) {
        if (eq.colaboradores?.length < 2) {
            await deleteEquipeById(eq.id);
        } else {
            const removeMember = eq.colaboradores.filter(m => m != colId);
            await updateEquipe({ criador_equipe: removeMember[0], colaboradores: removeMember }, eq.id);
        }
    }

    //removing user as colaborador
    await editById({ empresa: null }, colId);
    await editEmpresaByColId({ usuario_criador: null }, colId);

    const { data, error } = await supaCli.from("Colaborador").delete().eq("id", colId);
    if (error != null) return response(null, true, error.message, error.code);

    await supaCli.auth.admin.deleteUser(col.user_id);

    return response(true);
}