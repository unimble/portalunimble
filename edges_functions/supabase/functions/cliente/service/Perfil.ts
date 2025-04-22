import { supaCli } from "../../utils/supaClient.ts";
import { response } from "../../utils/utils.ts";

import { getUserPermissions, deleteAllPermitionByPerfilId, addPermitionByPerfilId } from "./Permissao.ts";
import { getColaboradorByUserId } from "./Colaborador.ts";

export const getDefaultPerfil = async () => {
    const { data, error } = await supaCli.from("Perfil").select("*").eq("padrao", "TRUE");

    if (error != null) return response(null, true, error.message, error.code);

    return data[0];
}

export const getInvitePerfil = async () => {
    const { data, error } = await supaCli.from("Perfil").select("*").eq("nome", "Colaborador");

    if (error != null) return response(null, true, error.message, error.code);

    return data[0];
}

export const getPerfilById = async (perfilId: string) => {
    const { data, error } = await supaCli.from("Perfil").select("*").eq("id", perfilId);

    if (error != null) return response(null, true, error.message, error.code);

    return data[0];
}

export const registerPerfil = async (name: string) => {
    const { data, error } = await supaCli.from("Perfil").insert([{ nome: name }]).select();

    if (error != null) return response(null, true, error.message, error.code);;

    return data[0].id;
}

export const getAllPerfil = async (name, html) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error, msg, code } = await getList();

    if (error) return response(null, true, `Erro ao recuperar lista`);

    let listIds = [];

    data.forEach(function (item) {
        listIds.push(item.id);
    });

    const permissions = await getUserPermissions(listIds);

    let formattedObj = [];

    data.forEach(function (item) {
        const permissionList = permissions.filter(subitem => subitem.perfil == item.id).map(filteredItem => filteredItem.permissao);
        formattedObj.push({ ...item, permission: permissionList, visible: false });
    });

    return response(formattedObj);
}

export const getList = async () => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Perfil").select("*");

    if (error != null) return response(null, true, error.message, error.code);

    return response(data);
}

export const deletePerfilById = async (id) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Perfil").delete().eq("id", id);

    if (error != null) return response(null, true, error.message, error.code);

    return response(data);
}

export const updatePermission = async (list, id) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const delPermission = await deleteAllPermitionByPerfilId(id);
    if (!delPermission) return response(null, true, "Não foi possivel realizar essa ação");

    let permissionList = [];

    list.forEach((item) => {
        if (item.nome != "DELEGAR_PERMISSAO_AO_PERFIL") {
            permissionList.push({ perfil: id, permissao: item.id, autorizado: "TRUE" })
        }
    })

    const addPermission = await addPermitionByPerfilId(permissionList);
    if (addPermission.error) return response(null, true, addPermission.message, addPermission.code);

    return response(addPermission);
}