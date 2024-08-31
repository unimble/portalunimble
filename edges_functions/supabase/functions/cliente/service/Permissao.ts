import { supaCli } from "../../utils/supaClient.ts";
import { response } from "../../utils/utils.ts";

export const addPermitionByPerfilId = async (list) => {
    const { data, error } = await supaCli.from("Perfil-Permissao").insert(list).select("*");

    if (error != null) return response(null, true, error.message, error.code);

    return data;
}

export const addPermition = async (name) => {
    const { data, error } = await supaCli.from("Permissao").insert([{ nome: name }]).select("*");

    if (error != null) return response(null, true, error.message, error.code);

    return data;
}

export const deleteAllPermitionByPerfilId = async (perfilId) => {
    const perfilPermissions = await supaCli.from("Perfil-Permissao").select(`
        id,
        perfil, 
        permissao (
            id, 
            nome
        ) 
        `).eq("perfil", perfilId);

    const inIds = perfilPermissions.data.filter(pp => pp.permissao.nome != "DELEGAR_PERMISSAO_AO_PERFIL").map(pp => pp.id);
    const { data, error } = await supaCli.from("Perfil-Permissao").delete().in("id", inIds);

    if (error != null) return response(null, true, error.message, error.code);

    return true;
}

export const deletePermitionById = async (id) => {
    const { data, error } = await supaCli.from("Permissao").delete().eq("id", id);

    if (error != null) return response(null, true, error.message, error.code);

    return true;
}

export const getUserPermissions = async (id) => {

    if (Array.isArray(id)) {
        const { data, error } = await supaCli.from("Perfil-Permissao").select(`
            id, 
            perfil,
            permissao ( id, nome )
            `).in("perfil", id);

        if (error != null) return false;

        return data;
    } else {
        const { data, error } = await supaCli.from("Perfil-Permissao").select(`
            id, 
            perfil,
            permissao ( id, nome )
            `).eq("perfil", id);

        if (error != null) return false;

        return data;
    }
}