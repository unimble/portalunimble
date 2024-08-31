import { response, isNumber } from "../../utils/utils.ts";
import * as service from "../service/Permissao.ts";

export const addPermissao = async (params, body, user) => {
    const { name } = body;

    if (!name) return response(null, true, "Informe o nome do tipo de dado");

    const { data, error, msg, code } = await service.addPermition(name);

    if (error) return response(null, true, msg, code);

    return response(data);
}

export const delPermissao = async (params, body) => {
    const { id } = params;

    const { data, error, msg, code } = await service.deletePermitionById(id);

    if (error && code == "23503") return response(null, true, "Não é possivel apagar essa permissão", code);

    if (error) return response(null, true, msg, code);

    return response({});
}