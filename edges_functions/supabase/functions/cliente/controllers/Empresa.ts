import { response, isNumber } from "../../utils/utils.ts";
import * as service from "../service/User.ts";

import * as empresaService from "../service/Empresa.ts";
import * as usuarioService from "../service/Usuario.ts";
import { getColaboradorByUserIdExpand, getColaboradorByUserId } from "../service/Colaborador.ts";

export const editEmpresa = async (params, body, user) => {
    const { name } = body;

    const Colaborador = await getColaboradorByUserId(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    const { data, error, msg, code } = await empresaService.editEmpresaByColId({ nome: name }, Colaborador.id);

    if (error) return response(null, true, msg, code);

    return response(data);
}