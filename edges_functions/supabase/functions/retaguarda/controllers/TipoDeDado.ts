import { response, isNumber } from "../../utils/utils.ts";
import * as service from "../service/TipoDeDado.ts";

export const delTipoDado = (params, body) => {
    return "Deletando Tipo de Dado...";
}

export const addTipoDado = async (params, body) => {
    const { name, html } = body;
    
    if (!name) return response(null, true, "Informe o nome do tipo de dado");
    if (!html || !isNumber(html)) return response(null, true, "Informe um nº valido para HTML do tipo de dado");

    const { data, error, msg, code } = await service.addTipoDado(name, html);

    if (error) return response(null, true, msg, code);

    return response({ tipodedado: data });
}