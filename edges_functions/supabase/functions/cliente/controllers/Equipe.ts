import { response, isNumber, getNanoId } from "../../utils/utils.ts";
import * as service from "../service/Equipe.ts";

export const setNano = async (params, body, user) => {
    const equipes = await service.getAll();

    // if (error) return response(null, true, msg, code);

    for(const equipe of equipes){
        await service.updateEquipe({mnemonico: getNanoId()}, equipe.id)
    }

    return response({id: getNanoId()});
}