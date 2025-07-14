import { response, isNumber, arraysAreEqual } from "../../utils/utils.ts";
import * as dadoService from "../service/Dado.ts";
import * as TipoItemService from "../service/TipoDeItem.ts";
import * as TipoDadoService from "../service/TipoDeDado.ts";
import * as metaInstanciaService from "../service/MetaInstancia.ts";
import * as metaEstruturaService from "../service/MetaEstrutura.ts";
import * as ItemService from "../service/Item.ts";
import * as MetaDadosService from "../service/MetaDados.ts";

//cliente
import { getColaboradorByUserId, getColaboradorByUserIdExpand, editColaboradorPlanejamento } from "../../cliente/service/Colaborador.ts";
import { getEmpresaByColaboradorId } from "../../cliente/service/Empresa.ts";
import { verifyEquipe } from "../../cliente/service/Equipe.ts";
import { getUsuarioById } from "../../cliente/service/Usuario.ts";


export const addComentario = async (params, body, user) => {
    const { conteudo, commentId } = body;

    const registerMetadado = await MetaDadosService.registerMetadado("Comentários", conteudo, user.id);
    if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);

    const getItem = await ItemService.getItensByItemId(commentId);
    if (getItem.error) return response(null, true, getItem.msg, getItem.code);

    let newDepende: any = [];

    if (getItem[0].depende_de) {
        newDepende = String(getItem[0].depende_de).split(',').map(Number);
        newDepende.push(registerMetadado.data?.id);
    } else {
        newDepende.push(registerMetadado.data?.id);
    }

    const update = await ItemService.updateItemById({ depende_de: newDepende }, commentId);
    if (update.error) return response(null, true, update.msg, update.code);

    //formating value
    const estruturaDependente = await metaInstanciaService.getMetaInstanciaByIdsExpand(registerMetadado.data.elem);
    if (estruturaDependente.error) return response(null, true, estruturaDependente.msg, estruturaDependente.code);

    const tipoItemData = await TipoItemService.getItemById(registerMetadado.data.item);
    if (tipoItemData.error) return response(null, true, tipoItemData.msg, tipoItemData.code);

    const subData = [];

    for (const est of estruturaDependente) {
        subData.push({
            html: est.dado.TipoDeDado.campohtml,
            conteudo: est.dado.Conteudo,
            ordem: est.metaEstrutura.ordem,
            idMetaEstrutura: est.metaEstrutura.id,
            idTipoDado: est.dado.TipoDeDado.id,
            nomeDado: est.dado.TipoDeDado.nomedodado,
            origem: 'dependente',
            dependeDeId: registerMetadado.data.id
        });
    }

    return response({
        instanceId: registerMetadado.data.id,
        createdAt: registerMetadado.data.created_at,
        profile: getItem[0].criador,
        tipoItemName: tipoItemData.nome,
        dados: subData
    });
}

export const addKanban = async (params, body, user) => {
    const { conteudo } = body;

    const registerMetadado = await MetaDadosService.registerMetadado("Kanban", conteudo, user.id);
    if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);

    return response(registerMetadado.data);
}

export const addCiclo = async (params, body, user) => {
    const { conteudo } = body;

    const registerMetadado = await MetaDadosService.registerMetadado("Ciclo", conteudo, user.id);
    if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);

    return response(registerMetadado.data);
}

export const addForça = async (params, body, user) => {
    const { conteudo } = body;

    const registerMetadado = await MetaDadosService.registerMetadado("Forças", conteudo, user.id);
    if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);

    return response(registerMetadado.data);
}

export const addOportunidades = async (params, body, user) => {
    const { conteudo } = body;

    const registerMetadado = await MetaDadosService.registerMetadado("Oportunidades", conteudo, user.id);
    if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);

    return response(registerMetadado.data);
}

export const addConquistas = async (params, body, user) => {
    const { conteudo } = body;

    const registerMetadado = await MetaDadosService.registerMetadado("Conquistas", conteudo, user.id);
    if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);

    return response(registerMetadado.data);
}

export const addObjetivos = async (params, body, user) => {
    const { conteudo, okrId } = body;

    const registerMetadado = await MetaDadosService.registerMetadado("Objetivos", conteudo, user.id);
    if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);

    if (okrId) {
        const updateObjetivo = await MetaDadosService.updateMetadadoItem("Resultados", [registerMetadado.data.id], user.id, okrId);
        if (updateObjetivo.error) return response(null, true, updateObjetivo.msg, updateObjetivo.code);

        return response(updateObjetivo.data);
    }

    return response(registerMetadado.data);
}

export const editProjectIncludeTask = async (params, body, user) => {
    const { projId, taskId } = params;

    const edit = await MetaDadosService.updateMetadadoItem("Projeto", [taskId], user.id, projId);
    if (edit.error) return response(null, true, edit.msg, edit.code);

    return response(edit.data);
}

export const addResultado = async (params, body, user, headers) => {
    const { conteudo } = body;

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    if(headers["x-context"] != ""){
        const verifyIfContextIsMine = await verifyEquipe(Colaborador.id, headers["x-context"]);

        if(!verifyIfContextIsMine || verifyIfContextIsMine.length == 0){
            return response(null, true, `Você não possue acesso a essa equipe`);
        }
    }

    const resultado = await TipoItemService.getItemFullStructureByName("Resultados");
    if (!resultado) return response(null, true, `Tipo de item ciclo não existe`);

    const resultadoExist = await ItemService.getItensByItemBaseByColaborador(resultado.tipoItem.id, Colaborador.id);
    if (resultadoExist.length > 0) {
        const bodyStruture = JSON.parse(conteudo);
        const bdStruture = String(resultadoExist[0].depende_de).split(',').map(Number);

        if (!arraysAreEqual(bodyStruture, bdStruture)) {
            const updateMetadado = await MetaDadosService.updateMetadadoItem("Resultados", bodyStruture, user.id, resultadoExist[0].id, true);
            if (updateMetadado.error) return response(null, true, updateMetadado.msg, updateMetadado.code);
            return response(updateMetadado.data);
        }

        return response(true);
    } else {
        const registerMetadado = await MetaDadosService.registerMetadadoItem("Resultados", conteudo, user.id);
        if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);

        if (headers["x-context"] != "") {
            await ItemService.updateItemById({ equipe: headers["x-context"] }, registerMetadado.data.id);
        }

        return response(registerMetadado.data);
    }
}

export const addResultadoFromScratch = async (params, body, user, headers) => {
    const { ciclo, data } = body;

    const checkCicle = await ItemService.getItensByItemId(ciclo);
    if (!checkCicle || checkCicle.length == 0) return response(null, true, `Informe um ciclo valido`);

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    if(headers["x-context"] != ""){
        const verifyIfContextIsMine = await verifyEquipe(Colaborador.id, headers["x-context"]);

        if(!verifyIfContextIsMine || verifyIfContextIsMine.length == 0){
            return response(null, true, `Você não possue acesso a essa equipe`);
        }
    }

    const resultado = await TipoItemService.getItemFullStructureByName("Resultados");
    if (!resultado) return response(null, true, `Tipo de item ciclo não existe`);

    let equipe = (headers["x-context"] != "") ? headers["x-context"] : null;

    const registerMetadado = await MetaDadosService.registerMetadadoItem("Resultados", [ciclo], user.id, equipe);
    if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);

    const objsIds = [];

    for (const obj of data) {
        const registerObj = await MetaDadosService.registerMetadado("Objetivos", obj.content, user.id);
        if (registerObj.error) return response(null, true, registerObj.msg, registerObj.code);

        const metasIds = [];

        for (const meta of obj.metas) {
            const registerMeta = await MetaDadosService.registerMetadado("Meta", meta.content, user.id);
            if (registerMeta.error) return response(null, true, registerMeta.msg, registerMeta.code);

            metasIds.push(registerMeta.data.id);
        }

        if (metasIds.length > 0) {
            const updateObjetivo = await MetaDadosService.updateMetadadoItem("Objetivos", metasIds, user.id, registerObj.data.id);
            if (updateObjetivo.error) return response(null, true, updateObjetivo.msg, updateObjetivo.code);
        }

        objsIds.push(registerObj.data.id);
    }

    const updateResultado = await MetaDadosService.updateMetadadoItem("Resultados", objsIds, user.id, registerMetadado.data.id);
    if (updateResultado.error) return response(null, true, updateResultado.msg, updateResultado.code);

    return response(updateResultado);
}

export const addResultadoDuplicar = async (params, body, user, headers) => {
    const { cycleId, cycleBase, keepValue } = params;

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    if(headers["x-context"] != ""){
        const verifyIfContextIsMine = await verifyEquipe(Colaborador.id, headers["x-context"]);

        if(!verifyIfContextIsMine || verifyIfContextIsMine.length == 0){
            return response(null, true, `Você não possue acesso a essa equipe`);
        }
    }

    let metaDado = await MetaDadosService.getMetaDadosSingleTemp("Resultados", Colaborador.id, "", cycleId);
    if (metaDado.error) return response(null, true, "Não foi possivel resgatar esse metadado");

    let resultToCopy: any = metaDado[0].components.filter(d =>  d.nome === "Objetivos");


    if (resultToCopy.length === 0) return response(null, true, "Resultado não possui objetivos para copiar!");

    let objectivesIds: any = [];

    for (const objective of resultToCopy) {
        const { dados } = objective;

        const name = objective.data["Nome"];
        const desc = objective.data["Descrição"];

        const nameId = objective.dataId["Nome"];
        const descId = objective.dataId["Descrição"];

        const metas = objective.components?.filter(d => d.nome == "Meta");

        const metasIds: any = [];
        if (metas && metas.length > 0) {
            for (const meta of metas) {
                const ids = Object.values(meta.dataId);

                let conteudo: any = [];
                Object.entries(meta.data).forEach((d: any) => {
                    conteudo.push({ id: meta.dataId[d[0]], text: d[1], tag: d[0] });
                });

                if (keepValue == "false") {
                    conteudo = conteudo?.filter(i => i.tag != "Meta atual");
                }

                const registerMetadado: any = await MetaDadosService.registerMetadado("Meta", conteudo, user.id);
                if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);
                metasIds.push(registerMetadado.data.id);
            }
        }

        const objectiveConteudo: any = [
            { id: nameId, text: name },
            { id: descId, text: desc }
        ];

        const registerObjective: any = await MetaDadosService.registerMetadado("Objetivos", objectiveConteudo, user.id);
        if (registerObjective.error) return response(null, true, registerObjective.msg, registerObjective.code);

        if (metasIds.length > 0) {
            const updateObjetivo = await MetaDadosService.updateMetadadoItem("Objetivos", metasIds, user.id, registerObjective.data.id);
            if (updateObjetivo.error) return response(null, true, updateObjetivo.msg, updateObjetivo.code);
        }

        objectivesIds.push(registerObjective.data.id);
    }

    const registerResultado: any = await MetaDadosService.registerMetadadoItem("Resultados", [cycleBase], user.id);
    if (registerResultado.error) return response(null, true, registerResultado.msg, registerResultado.code);

    if(headers["x-context"] != ""){
        await ItemService.updateItemById({equipe: headers["x-context"]}, registerResultado.data.id); 
    }

    const updateResultado = await MetaDadosService.updateMetadadoItem("Resultados", [...objectivesIds, cycleBase], user.id, registerResultado.data.id, true);
    if (updateResultado.error) return response(null, true, updateResultado.msg, updateResultado.code);

    return response(registerResultado.data);
}

export const addMeta = async (params, body, user) => {
    const { conteudo, objetivoId } = body;

    const registerMetadado = await MetaDadosService.registerMetadado("Meta", conteudo, user.id);
    if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);

    const updateObjetivo = await MetaDadosService.updateMetadadoItem("Objetivos", [registerMetadado.data.id], user.id, objetivoId);
    if (updateObjetivo.error) return response(null, true, updateObjetivo.msg, updateObjetivo.code);

    return response(updateObjetivo.data);
}

export const addTarefa = async (params, body, user, headers) => {
    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    if(headers["x-context"] != ""){
        const verifyIfContextIsMine = await verifyEquipe(Colaborador.id, headers["x-context"]);

        if(!verifyIfContextIsMine || verifyIfContextIsMine.length == 0){
            return response(null, true, `Você não possue acesso a essa equipe`);
        }
    }
    
    const registerMetadado = await MetaDadosService.registerMetadado("Tarefas", null, user.id);
    if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);

    if(headers["x-context"] != ""){
        await ItemService.updateItemById({equipe: headers["x-context"]}, registerMetadado.data.id); 
    }

    return response(registerMetadado.data);
}

export const addBlank = async (params, body, user, headers) => {
    const { item } = params;

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);
    
    if(headers["x-context"] != ""){
        const verifyIfContextIsMine = await verifyEquipe(Colaborador.id, headers["x-context"]);

        if(!verifyIfContextIsMine || verifyIfContextIsMine.length == 0){
            return response(null, true, `Você não possue acesso a essa equipe`);
        }
    }

    const tipoItem = await TipoItemService.getItemByName(item);
    if (tipoItem.error) return response(null, true, tipoItem.msg, tipoItem.code);

    const tipoItemEstrutura = await metaEstruturaService.getByItemIdExpand(tipoItem.id);
    if (tipoItemEstrutura.error) return response(null, true, tipoItemEstrutura.msg, tipoItemEstrutura.code);

    const text = tipoItemEstrutura.map(d => {
        if (d.dadoDependente) {
            return { id: d.dadoDependente.id, text: "" }
        }
    }).filter(f => f != null);

    const registerMetadado = await MetaDadosService.registerMetadado(item, text, user.id);
    if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);

    if (headers["x-context"] != "") {
        await ItemService.updateItemById({ equipe: headers["x-context"] }, registerMetadado.data.id);
    }

    //formating value
    const estruturaDependente = await metaInstanciaService.getMetaInstanciaByIdsExpand(registerMetadado.data.elem);
    if (estruturaDependente.error) return response(null, true, estruturaDependente.msg, estruturaDependente.code);

    const subData = [];

    for (const est of estruturaDependente) {
        subData.push({
            html: est.dado.TipoDeDado.campohtml,
            conteudo: est.dado.Conteudo,
            ordem: est.metaEstrutura.ordem,
            idMetaEstrutura: est.metaEstrutura.id,
            idTipoDado: est.dado.TipoDeDado.id,
            nomeDado: est.dado.TipoDeDado.nomedodado,
            origem: 'dependente',
            dependeDeId: registerMetadado.data.id
        });
    }

    const getItem = await ItemService.getItensByItemId(registerMetadado.data.id);
    if (getItem.error) return response(null, true, getItem.msg, getItem.code);

    return response({
        instanceId: registerMetadado.data.id,
        createdAt: registerMetadado.data.created_at,
        profile: getItem[0].criador,
        tipoItemName: item,
        dados: subData
    });
}

export const addProcesso = async (params, body, user, headers) => {
    const { conteudo } = body;

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);
    
    if(headers["x-context"] != ""){
        const verifyIfContextIsMine = await verifyEquipe(Colaborador.id, headers["x-context"]);

        if(!verifyIfContextIsMine || verifyIfContextIsMine.length == 0){
            return response(null, true, `Você não possue acesso a essa equipe`);
        }
    }

    const registerMetadado = await MetaDadosService.registerMetadado("Processos", conteudo, user.id);
    if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);

    if(headers["x-context"] != ""){
        await ItemService.updateItemById({equipe: headers["x-context"]}, registerMetadado.data.id); 
    }

    return response(registerMetadado.data);
}

export const addProjeto = async (params, body, user, headers) => {
    const { conteudo } = body;

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);
    
    if(headers["x-context"] != ""){
        const verifyIfContextIsMine = await verifyEquipe(Colaborador.id, headers["x-context"]);

        if(!verifyIfContextIsMine || verifyIfContextIsMine.length == 0){
            return response(null, true, `Você não possue acesso a essa equipe`);
        }
    }

    const registerMetadado = await MetaDadosService.registerMetadado("Projeto", conteudo, user.id);
    if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);

    if(headers["x-context"] != ""){
        await ItemService.updateItemById({equipe: headers["x-context"]}, registerMetadado.data.id); 
    }

    return response(registerMetadado.data);
}

export const addMetaAtual = async (params, body, user) => {
    const { metaId, metaAtual } = body;

    const meta = await MetaDadosService.getMetaDadosById("Meta", metaId);
    if (!meta) return response(null, true, "Erro ao registrar meta atual");

    const { dados } = meta.components;
    const metaAtualRow = dados.filter(m => m.dado === "Meta atual")[0];
    const metaAlvoRow = dados.filter(m => m.dado === "Meta alvo")[0];

    const tipoDado = await TipoDadoService.getTipoDeDadoByName("Meta atual");
    if (tipoDado.error) return response(null, true, "Erro ao registrar meta atual");

    if (!metaAtualRow) {
        const updateInstancia = await MetaDadosService.updateIntancia("Meta", [{ id: tipoDado.data.id, text: metaAtual }], metaId);
        if (updateInstancia.error) return response(null, true, updateInstancia.msg, updateInstancia.code);

        return response(updateInstancia);
    }

    const updateMeta = await MetaDadosService.editMetaDado(metaId, [{ id: tipoDado.data.id, text: metaAtual }]);
    if (updateMeta.error) return response(null, true, updateMeta.msg, updateMeta.code);

    return response(true);
}

export const editTarefaConcluido = async (params, body, user) => {
    const { item } = params;
    const { conteudo } = body;

    const task = await MetaDadosService.getMetaDadosById("Tarefas", item);
    if (!task) return response(null, true, "Erro ao resgatar meta atual");

    const { dados } = task.components;
    const taskFinish = dados.filter(m => m.dado === "Data de conclusão")[0];

    if (!taskFinish) {
        const updateInstancia = await MetaDadosService.updateIntancia("Tarefas", conteudo, item);
        if (updateInstancia.error) return response(null, true, updateInstancia.msg, updateInstancia.code);

        return response(updateInstancia);
    } else {
        const edited = await MetaDadosService.editMetaDado(item, conteudo);

        return response(edited);
    }
}

export const editItem = async (params, body, user) => {
    const { item } = params;
    const { conteudo } = body;

    const edited = await MetaDadosService.editMetaDado(item, conteudo);

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    const instance = await ItemService.getItensByItemIdExpandTipoItem(item);
    if (!instance) return response(null, true, `Colaborador não existe`);

    let metaDado = await MetaDadosService.getMetaDadosSingleTemp(instance[0].item.nome, Colaborador.id, '', item);
    if (metaDado.error) return response(null, true, "Não foi possivel resgatar esse metadado");

    return response({
        metaDado,
    });
}

export const editCycle = async (params, body, user) => {
    const { item } = params;
    const { conteudo } = body;

    const ciclo = await MetaDadosService.getMetaDadosById("Ciclo", item);
    if (!ciclo) return response(null, true, "Erro ao editar ciclo");

    const { dados } = ciclo.components;
    const encerrado = dados.filter(m => m.dado === "Encerrado")[0];

    const tipoDado = await TipoDadoService.getTipoDeDadoByName("Encerrado");
    if (tipoDado.error) return response(null, true, "Erro ao editar ciclo");

    if (!encerrado) {
        const conteudoArray = (!Array.isArray(conteudo)) ? JSON.parse(conteudo) : conteudo;
        const value = conteudoArray.filter(val => val.id == tipoDado.data.id)[0];

        const updateInstancia = await MetaDadosService.updateIntancia("Ciclo", [{ id: tipoDado.data.id, text: value.text }], item);
        if (updateInstancia.error) return response(null, true, updateInstancia.msg, updateInstancia.code);
    }

    const edited = await MetaDadosService.editMetaDado(item, conteudo);

    return response(edited);
}

export const editProcess = async (params, body, user) => {
    const { item } = params;
    const { conteudo } = body;

    let metaDado = await MetaDadosService.getMetaDadosById("Processos", item);
    if (metaDado.error) return response(null, true, "Não foi possivel resgatar esse metadado");

    let equipe = null;

    if (metaDado.equipe) {
        equipe = metaDado.equipe.id;
    }

    const registerMetadado = await MetaDadosService.registerMetadado("Processos", conteudo, user.id, equipe);
    if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);

    const updateItem = await ItemService.updateItemById({ depende_de: [item] }, registerMetadado.data.id);

    return response(updateItem);
}

export const editInstanciaItem = async (params, body, user) => {
    const { item } = params;
    const { conteudo } = body;

    const itemIntance = await ItemService.getItensByItemId(item);
    if (itemIntance.error) return response(null, true, "Erro ao editar tarefa");

    const updateMeta = await MetaDadosService.editMetaDado(item, conteudo);
    if (updateMeta.error) return response(null, true, updateMeta.msg, updateMeta.code);

    return response(updateMeta);
}

export const delItem = async (params, body, user) => {
    const { id } = params;

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    const deleteResult = await MetaDadosService.deleteMetadado(id, Colaborador.id);
    if (deleteResult.error) return response(null, true, deleteResult.msg, deleteResult.code);

    return response(deleteResult);
}

export const finish = async (params, body, user) => {
    const edited = await editColaboradorPlanejamento(user.id, true);

    return response(edited);
}

export const getCiclo = async (params, body, user) => {
    let ciclo = await MetaDadosService.getMetaDados("Ciclo");
    return response(ciclo);
}

export const getPlanejamento = async (params, body, user) => {
    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    const Empresa = await getEmpresaByColaboradorId(Colaborador.id);
    if (!Empresa) return response(null, true, `Empresa não existe`);

    let forcas = await MetaDadosService.getMetaDados("Forças", Colaborador.id);
    let oportunidades = await MetaDadosService.getMetaDados("Oportunidades", Colaborador.id);
    let conquistas = await MetaDadosService.getMetaDados("Conquistas", Colaborador.id);
    let objetivos = await MetaDadosService.getMetaDados("Objetivos", Colaborador.id);
    let resultados = await MetaDadosService.getMetaDados("Resultados", Colaborador.id);
    let cicloId = 0;

    if (resultados.components) {
        cicloId = resultados.components.dados.filter(c => c.nome == "Ciclo")[0].id;
    }

    return response({
        fullName: Colaborador.usuario.nome,
        companyName: Empresa[0].nome,
        urgency: Empresa[0].urgencia,
        forcas,
        cicloId: cicloId,
        oportunidades,
        conquistas,
        objetivos,
        resultados
    });
}

export const getPlanejamentoItemByTeam = async (params, body, user) => {
    const { item } = params;
    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    let metaDado = await MetaDadosService.getMetaDados(item, Colaborador.id, "team");
    if (metaDado.error) return response(null, true, "Não foi possivel resgatar esse metadado");

    return response({
        metaDado,
    });
}

export const getKanbanPadrao = async (params, body, user) => {
    const { item } = params;
    
    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    let metaDado = await MetaDadosService.getKanbanStandard();
    if (metaDado.error) return response(null, true, "Não foi possivel resgatar esse metadado");

    return response({
        metaDado,
    });
}

export const getProjectTasks = async (params, body, user) => {
    const { id } = params;
    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    const item = await TipoItemService.getItemFullStructureByName("Projeto");
    if (!item) return response(null, true, `Tipo de item ciclo não existe`);

    const itens = await ItemService.testee(decodeURIComponent(id), item.tipoItem.id);
    if (itens.error) return response(null, true, itens.msg, itens.code);

    // let metaDado = await MetaDadosService.getMetaDados(item, Colaborador.id, "team");
    // if (metaDado.error) return response(null, true, "Não foi possivel resgatar esse metadado");

    return response({
        itens,
    });
}

export const getProjectLider = async (params, body, user) => {
    const { id } = params;
    
    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    const Usuario = await getUsuarioById(id);
    if (!Usuario) return response(null, true, `Usuario não existe`);

    return response({
        Usuario,
    });
}

export const getProjectconclusion = async (params, body, user) => {
    const { id } = params;
    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    const value = await ItemService.getProjectSum(id);

    return response({
        value,
    });
}


export const getPlanejamentoByItem = async (params, body, user) => {
    const { item } = params;
    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    let metaDado = await MetaDadosService.getMetaDados(item, Colaborador.id);
    if (metaDado.error) return response(null, true, "Não foi possivel resgatar esse metadado");

    return response({
        metaDado,
    });
}

export const getMetaDadoAll = async (params, body, user, headers, query) => {
    const { item, kind } = params;

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    if(headers["x-context"] != ""){
        const verifyIfContextIsMine = await verifyEquipe(Colaborador.id, headers["x-context"]);

        if(!verifyIfContextIsMine || verifyIfContextIsMine.length == 0){
            return response(null, true, `Você não possue acesso a essa equipe`);
        }
    }

    let metaDado = await MetaDadosService.getMetaDadosTemp(item, Colaborador.id, kind ?? '', headers["x-context"], {
        perPage: query?.perpage,
        offset: query?.offset
    });

    if (!metaDado) return response(null, true, "Não foi possivel resgatar esse metadado");

    return response({
        metaDado: metaDado.data,
        total: metaDado.total
    });
}

export const getPlanejamentoByItemCompany = async (params, body, user) => {
    const { item } = params;
    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    let metaDado = await MetaDadosService.getMetaDados(item, Colaborador.empresa, "company");
    if (metaDado.error) return response(null, true, metaDado.error);

    return response({
        metaDado,
    });
}

export const getPlanejamentoByItemId = async (params, body, user) => {
    const { item, id } = params;

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    let metaDado = await MetaDadosService.getMetaDadosById(item, id);
    if (metaDado.error) return response(null, true, "Não foi possivel resgatar esse metadado");

    return response({
        metaDado,
    });
}

export const getMetaDadoSingle = async (params, body, user) => {
    const { item, id, kind } = params;

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    let metaDado = await MetaDadosService.getMetaDadosSingleTemp(item, Colaborador.id, kind, id);
    if (metaDado?.error) return response(null, true, "Não foi possivel resgatar esse metadado");

    return response({
        metaDado,
    });
}

export const getForm = async (params, body, user) => {
    const { kind } = params;

    let form = await MetaDadosService.getMetaDadosForm(decodeURIComponent(kind));
    if (!form) return response(null, true, `Tipo de item inexistente`);

    return response(form);
}

export const getFormEdit = async (params, body, user) => {
    const { id } = params;

    let form = await MetaDadosService.getMetaDadosFormEdit(id);
    if (!form) return response(null, true, `Tipo de item inexistente`);

    return response(form);
}