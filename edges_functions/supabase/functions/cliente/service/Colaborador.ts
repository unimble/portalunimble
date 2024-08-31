import { supaCli } from "../../utils/supaClient.ts";
import { response } from "../../utils/utils.ts";

export const registerColaborador = async (usuario: string, perfil: string, user_id: string) => {
    const { data, error } = await supaCli.from("Colaborador").insert([{ usuario, perfil, user_id }]).select("*");

    if (error != null) return false;

    return data[0];
}

export const getColaboradorByUserId = async (user_id: string) => {
    const { data, error } = await supaCli.from("Colaborador").select("*").eq("user_id", user_id);

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
        user_id,
        created_at   
    `).eq("user_id", user_id);

    if (error != null) return false;

    return data[0];
}

export const editColaboradorPerfil = async (user_id: string, perfilId:string) => {
    const { data, error } = await supaCli.from("Colaborador").update({perfil:perfilId}).eq("user_id", user_id);

    if (error != null) return response(null, true, error.message, error.code);

    return true;
}