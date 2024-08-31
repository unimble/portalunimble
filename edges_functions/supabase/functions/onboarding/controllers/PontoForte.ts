import { response, isNumber } from "../../utils/utils.ts";
import * as service from "../service/PontoForte.ts";

export const addPontoForte = async (params, body) => {
    const { list } = body;

    if (!list) return response(null, true, "Informe lista de pontos fortes");

    const listArray = Array.isArray(list) ? list : JSON.parse(list);

    const { data, error, msg, code } = await service.addPontoForte(listArray);

    if (error) return response(null, true, msg, code);

    return response({ tipodeitem: data.tipodeitem, meta: data.meta });
}