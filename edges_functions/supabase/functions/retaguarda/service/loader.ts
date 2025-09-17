import { response, isNumber } from "../../utils/utils.ts";
import { removeByEmail, getConviteByEmail } from "../../cliente/service/Convites.ts";
import {
    associateEquipeToColaborador,
    updateEquipeMember,
    getEquipesColaboradorIsIn,
    getEquipesByUrlId
} from "../../cliente/service/Equipe.ts";

import FilterResolver from "../../utils/filtersResolve.ts";

import { getColaboradorByUserIdExpandIn } from "../../cliente/service/Colaborador.ts";
import { getMetaDadosForm, getMetaDadosTemp } from "../../retaguarda/service/MetaDados.ts";

export const inviteVerify = async (Colaborador: any) => {
    const convites = await getConviteByEmail(Colaborador.usuario.email);
    if (convites.error) return response(null, true, `Erro ao verificar convites!`);

    if (convites.data.length > 0) {
        await Promise.all(
            convites.data.map(async (convite: any) => {
                await associateEquipeToColaborador(Colaborador.id, convite.equipe);
                await updateEquipeMember(Colaborador.id, convite.equipe);
            })
        );

        const removeConvites = await removeByEmail(Colaborador.usuario.email);
        if (!removeConvites) return response(null, true, `Erro ao verificar convites!`);
    }

    return response({});
}

export const getEquipe = async (Colaborador: any) => {
    const equipes = await getEquipesColaboradorIsIn([Colaborador.id], null);

    if (!equipes) return response(null, true, `Equipe não existe`);

    const obj = await Promise.all(
        equipes.map(async (equipe: any) => {
            const users = await getColaboradorByUserIdExpandIn(equipe.colaboradores);
            return {
                id: equipe.id,
                equipe: equipe.nome,
                urlId: equipe.mnemonico,
                criador: equipe.criador_equipe,
                empresa: equipe.empresa,
                users
            };
        })
    );

    obj.sort((a, b) => a.equipe.localeCompare(b.equipe, 'pt', { sensitivity: 'base' }));

    return response(obj);
}

export const getAllForms = async () => {
    const forms = ["Atas", "Projeto", "Processos", "Tarefas", "Objetivos", "Meta", "Kanban", "Forças", "Oportunidades", "Conquistas"];

    try {
        const results = await Promise.all(
            forms.map(async (form) => {
                const data = await getMetaDadosForm(form);
                if (!data) throw new Error(`Erro ao recuperar form de ${form}`);
                return { [form.toLowerCase()]: data };
            })
        );

        const merged = Object.assign({}, ...results);
        return response(merged);
    } catch (err:any) {
        return response(null, true, err.message);
    }
}

export const getMetaDadosAll = async (Colaborador:any, item:any, kind:any, query:any, headers:any) =>{
    // if (headers["x-context"] != "") {
    //     const verifyIfContextIsMine = await verifyEquipe(Colaborador.id, headers["x-context"]);
    //     const verifyIfContextIsMineByUrlId = await verifyEquipeByUrlId(Colaborador.id, headers["x-context"]);

    //     if (!verifyIfContextIsMine || verifyIfContextIsMine.length == 0 || !verifyIfContextIsMineByUrlId || verifyIfContextIsMineByUrlId.length == 0) {
    //         return response(null, true, `Você não possue acesso a essa equipe`);
    //     }
    // }

    let filters = "";

    if (query?.filters) {
        filters = JSON.parse(decodeURIComponent(query?.filters)) ?? null;
        const filterObj = new FilterResolver(filters, item);
        const { data, error } = await filterObj.resolver();

        filters = (!error) ? data : "";
    }

    let contextId = headers["x-context"];

    const nanoIdToId = await getEquipesByUrlId(contextId);

    if (nanoIdToId.length > 0) {
        contextId = nanoIdToId[0].id;
    }

    let metaDado:any = await getMetaDadosTemp(item, Colaborador.id, kind ?? '', contextId, {
        perPage: query?.perpage,
        offset: query?.offset
    }, filters);

    if (!metaDado) return response(null, true, "Não foi possivel resgatar esse metadado");

    return response({
        metaDado: metaDado.data,
        total: metaDado.total
    });
}