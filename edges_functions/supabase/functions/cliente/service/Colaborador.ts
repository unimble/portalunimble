import { supaCli } from "../../utils/supaClient.ts";
import { response } from "../../utils/utils.ts";

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
            googleid
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

export const getColaboradorByUserIdExpandIn = async (array) => {
    const { data, error } = await supaCli.from("Colaborador").select(`
        id,
        usuario (
            id,
            nome,
            email,
            empresas,
            googleid
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

export const editColaboradorPerfil = async (user_id: string, perfilId:string) => {
    const { data, error } = await supaCli.from("Colaborador").update({perfil:perfilId}).eq("user_id", user_id);

    if (error != null) return response(null, true, error.message, error.code);

    return true;
}

export const editEmpresa = async (user_id: string, empresa:string) => {
    const { data, error } = await supaCli.from("Colaborador").update({empresa}).eq("user_id", user_id);

    if (error != null) return response(null, true, error.message, error.code);

    return true;
}

export const editColaboradorPlanejamento = async (user_id: string, planejamentoDone:boolean) => {
    const { data, error } = await supaCli.from("Colaborador").update({planejamentoDone}).eq("user_id", user_id);

    if (error != null) return response(null, true, error.message, error.code);

    return true;
}