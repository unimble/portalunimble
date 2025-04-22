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

    return response(update);
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

export const addResultado = async (params, body, user) => {
    const { conteudo } = body;

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

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

        return response(registerMetadado.data);
    }
}

export const addResultadoFromScratch = async (params, body, user) => {
    const { ciclo, data } = body;

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    const resultado = await TipoItemService.getItemFullStructureByName("Resultados");
    if (!resultado) return response(null, true, `Tipo de item ciclo não existe`);

    const registerMetadado = await MetaDadosService.registerMetadadoItem("Resultados", [ciclo], user.id);
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

        const updateObjetivo = await MetaDadosService.updateMetadadoItem("Objetivos", metasIds, user.id, registerObj.data.id);
        if (updateObjetivo.error) return response(null, true, updateObjetivo.msg, updateObjetivo.code);

        objsIds.push(registerObj.data.id);
    }

    const updateResultado = await MetaDadosService.updateMetadadoItem("Resultados", objsIds, user.id, registerMetadado.data.id);
    if (updateResultado.error) return response(null, true, updateResultado.msg, updateResultado.code);

    return response(updateResultado);
    // const resultadoExist = await ItemService.getItensByItemBaseByColaborador(resultado.tipoItem.id, Colaborador.id);
    // if (resultadoExist.length > 0) {
    //     const bodyStruture = JSON.parse(conteudo);
    //     const bdStruture = String(resultadoExist[0].depende_de).split(',').map(Number);

    //     if (!arraysAreEqual(bodyStruture, bdStruture)) {
    //         const updateMetadado = await MetaDadosService.updateMetadadoItem("Resultados", bodyStruture, user.id, resultadoExist[0].id, true);
    //         if (updateMetadado.error) return response(null, true, updateMetadado.msg, updateMetadado.code);
    //         return response(updateMetadado.data);
    //     }

    //     return response(true);
    // } else {
    //     const registerMetadado = await MetaDadosService.registerMetadadoItem("Resultados", conteudo, user.id);
    //     if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);

    //     return response(registerMetadado.data);
    // }
}

export const addResultadoDuplicar = async (params, body, user) => {
    const { cycleId, cycleBase } = params;

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    let metaDado = await MetaDadosService.getMetaDados("Resultados", Colaborador.id);
    if (metaDado.error) return response(null, true, "Não foi possivel resgatar esse metadado");

    if (!Array.isArray(metaDado)) {
        metaDado = [metaDado];
    }

    let resultToCopy: any = {};
    for (const result of metaDado) {
        const { dados } = result.components;
        const [cycle] = dados.filter(d => d.nome === "Ciclo");

        if (cycle && cycle.id == cycleId) {

            resultToCopy = result;
        }
    }

    if (Object.keys(resultToCopy).length === 0) return response(null, true, "Não existe um resultado relacionado a esse ciclo!");

    const resultToCopyObjectives = resultToCopy.components.dados.filter(d => d.nome == "Objetivos")
    if (resultToCopyObjectives.length == 0 && resultToCopyObjectives[0] == undefined) return response(null, true, "Resultado não possui objetivos para copiar!");

    let objectivesIds: any = [];

    for (const objective of resultToCopyObjectives) {
        const { dados } = objective;

        const name = dados.filter(d => d.dado == "Nome")[0];
        const desc = dados.filter(d => d.dado == "Descrição")[0];

        const metas = dados.filter(d => d.nome == "Meta");

        const metasIds: any = [];
        if (metas.length > 0) {
            for (const meta of metas) {
                const { dados } = meta;

                const conteudo: any = [];
                dados.forEach((d: any) => {
                    if (d.dado != "Meta atual") {
                        conteudo.push({ id: d.dadoId, text: d.content });
                    }
                })


                const registerMetadado: any = await MetaDadosService.registerMetadado("Meta", conteudo, user.id);
                if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);
                metasIds.push(registerMetadado.data.id);
            }
        }

        const objectiveConteudo: any = [
            { id: name.dadoId, text: name.content },
            { id: desc.dadoId, text: desc.content }
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

    const updateResultado = await MetaDadosService.updateMetadadoItem("Resultados", [...objectivesIds, cycleBase], user.id, registerResultado.data.id, true);
    if (updateResultado.error) return response(null, true, updateResultado.msg, updateResultado.code);

    return response(updateResultado.data);
}

export const addMeta = async (params, body, user) => {
    const { conteudo, objetivoId } = body;

    const registerMetadado = await MetaDadosService.registerMetadado("Meta", conteudo, user.id);
    if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);

    const updateObjetivo = await MetaDadosService.updateMetadadoItem("Objetivos", [registerMetadado.data.id], user.id, objetivoId);
    if (updateObjetivo.error) return response(null, true, updateObjetivo.msg, updateObjetivo.code);

    return response(updateObjetivo.data);
}

export const addTarefa = async (params, body, user) => {
    const registerMetadado = await MetaDadosService.registerMetadado("Tarefas", null, user.id);
    if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);

    return response(registerMetadado.data);
}

export const addProcesso = async (params, body, user) => {
    const { conteudo, equipe } = body;

    const registerMetadado = await MetaDadosService.registerMetadado("Processos", conteudo, user.id, equipe);
    if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);

    return response(registerMetadado.data);
}

export const addProjeto = async (params, body, user) => {
    const { conteudo } = body;

    const registerMetadado = await MetaDadosService.registerMetadado("Projeto", conteudo, user.id);
    if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);

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

    if (parseFloat(metaAtual) > parseFloat(metaAlvoRow.content)) return response(null, true, "Informe um valor menor que a meta alvo");

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

    if (!itemIntance[0].elem) {
        const updateInstancia = await MetaDadosService.updateIntancia("Tarefas", conteudo, item);
        if (updateInstancia.error) return response(null, true, updateInstancia.msg, updateInstancia.code);

        return response(updateInstancia);
    } else {
        const updateMeta = await MetaDadosService.editMetaDado(item, conteudo);
        if (updateMeta.error) return response(null, true, updateMeta.msg, updateMeta.code);

        return response(updateMeta);
    }
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
    const { item } = params;

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