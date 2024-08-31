import { response, isNumber } from "../../utils/utils.ts";
import * as service from "../service/User.ts";

import * as empresaService from "../service/Empresa.ts";
import * as usuarioService from "../service/Usuario.ts";
import { getColaboradorByUserId } from "../service/Colaborador.ts";

export const addUser = async (params, body, user) => {
    const { data, error, msg, code } = await service.registerUser(user);

    if (error) return response(null, true, msg, code);

    return response(data);
}

export const complementar = async (params, body, user) => {
    const { item } = params;
    const { name, urgency, company } = body;

    if (name.length == 0 || urgency.length == 0 || company.length == 0) return response(false);

    const Colaborador = await getColaboradorByUserId(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    const empresa = await empresaService.editEmpresaByColId({ urgencia: urgency, nome: company }, Colaborador.id);
    if (!empresa) return response(null, true, "Erro ao complementar cadastro");

    const perfil = await usuarioService.editUsuarioById({ nome: name }, Colaborador.usuario);
    if (!perfil) return response(null, true, "Erro ao complementar cadastro");

    return response(true);
}