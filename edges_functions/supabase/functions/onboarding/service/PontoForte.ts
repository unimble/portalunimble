import { response, isNumber } from "../../utils/utils.ts";

//Service
import * as Dado from "./Dado.ts";

export const addPontoForte = async (list) => {
    let addObj = [];

    for(let item in list) {
        addObj.push({Conteúdo:item.title});
        addObj.push({Conteúdo:item.desc});
    }

    const dados = await Dado.addDado(addObj);

    return response({ dados: dados });
}