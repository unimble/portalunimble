import { response, isNumber } from "../../utils/utils.ts";
import * as service from "../service/Perfil.ts";
import * as ColaboradorService from "../service/Colaborador.ts";

export const getAllPerfil = async (params, body) => {
    const { data, error, msg, code } = await service.getAllPerfil();

    if (error) return response(null, true, msg, code);

    return response(data);
}

export const editPerfil = async (params, body) => {
    const { list } = body;
    const { id } = params;

    const permissionList = Array.isArray(list) ? list : JSON.parse(list);

    const { data, error, msg, code } = await service.updatePermission(permissionList, id);

    if (error) return response(null, true, msg, code);

    return response(data);
}

export const editUserPerfil = async (params, body) => {
    const { id, userId } = params;

    const { data, error, msg, code } = await ColaboradorService.editColaboradorPerfil(userId, id);

    if (error) return response(null, true, msg, code);

    return response(data);
}

export const addPerfil = async (params, body) => {
    const { name } = body;

    const { data, error, msg, code } = await service.registerPerfil(name);

    if (error) return response(null, true, msg, code);

    return response(data);
}

export const delPerfil = async (params, body) => {
    const { id } = params;

    const { data, error, msg, code } = await service.deletePerfilById(id);

    if (error && code == "23503") return response(null, true, "Não é possivel apagar esse Perfil", code);

    if (error) return response(null, true, msg, code);

    return response({});
}