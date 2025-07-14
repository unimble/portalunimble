import { response, isNumber } from "../../utils/utils.ts";
import * as service from "../service/User.ts";

import * as empresaService from "../service/Empresa.ts";
import * as usuarioService from "../service/Usuario.ts";
import { getColaboradorByUserIdExpand, getColaboradorByUserId } from "../service/Colaborador.ts";

export const addUser = async (params, body, user) => {
    const { data, error, msg, code } = await service.registerUser(user);

    if (error) return response(null, true, msg, code);

    return response(data);
}

export const addUserProfile = async (params, body, user) => {
    const { conteudo } = body;

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    if(Colaborador.usuario.googleid.toString().length == 0 && Colaborador.usuario.profile.toString().length > 0){
       await usuarioService.deleteUserProfile(Colaborador.usuario.profile.toString());
    }

    const up = await usuarioService.uploadImageProfile(conteudo);
    if (!up) return response(null, true, `Não foi possivel atualizar imagem`);

    const edit = await usuarioService.editUsuarioById({profile: up}, Colaborador.usuario.id);
    if (!edit) return response(null, true, `Não foi possivel atualizar imagem`);

    return response(true);
}

export const editUserName = async (params, body, user) => {
    const { conteudo } = body;

    const Colaborador = await getColaboradorByUserId(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    const edit = await usuarioService.editUsuarioById({nome: conteudo}, Colaborador.usuario);
    if (!edit) return response(null, true, `Não foi possivel atualizar nome`);

    return response(true);
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