import { response, isNumber } from "../../utils/utils.ts";
import * as service from "../service/TipoDeItem.ts";
import * as ItemService from "../service/Item.ts";
import * as dadoService from "../service/Dado.ts";
import * as metaInstanciaService from "../service/MetaInstancia.ts";

export const delTipoItem = async (params, body) => {
    const { id } = params;

    const { data, error, msg, code } = await service.deleteItemById(id);

    if (error && code == "23503") return response(null, true, "Não é possivel apagar esse Tipo de item", code);

    if (error) return response(null, true, msg, code);

    return response({});
}

export const addTipoItem = async (params, body) => {
    const { name, meta } = body;

    if (!name) return response(null, true, "Informe o nome do tipo de item");

    const { data, error, msg, code } = await service.addTipoItem(name, meta);

    if (error) return response(null, true, msg, code);

    return response({ tipodeitem: data.tipodeitem, meta: data.meta });
}

export const editTipoItem = async (params, body) => {
    const { id } = params;
    const { name, meta } = body;

    const { data, error, msg, code } = await service.editTipoItem(id, name, meta);

    if (error) return response(null, true, msg, code);

    return response(data);
}

export const editTipoItemStructure = async (params, body) => {
    const { id } = params;
    const { meta } = body;

    const { data, error, msg, code } = await service.editStructure(meta, id);

    if (error) return response(null, true, msg, code);

    return response(data);
}