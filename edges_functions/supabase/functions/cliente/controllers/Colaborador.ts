import { response, isNumber } from "../../utils/utils.ts";
import * as service from "../service/Perfil.ts";
import * as ColaboradorService from "../service/Colaborador.ts";

export const delColaborador = async (params, body, user) => {
    const { id } = params;
    const { data, error } = await ColaboradorService.deleteColaboradorById(id);

    if (error) return response(null, true, error.msg, error.code);

    return response(data);
}