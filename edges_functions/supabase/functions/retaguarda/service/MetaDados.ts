import { supaCli } from "../../utils/supaClient.ts";
import { response } from "../../utils/utils.ts";

import * as dadoService from "./Dado.ts";
import * as TipoItemService from "./TipoDeItem.ts";
import * as ItemService from "./Item.ts";
import * as metaInstanciaService from "./MetaInstancia.ts";

//cliente
import { getColaboradorByUserId } from "../../cliente/service/Colaborador.ts";

var entrou = [];

export const getMetaDados = async (metadados, fromLoggedUser = false) => {
    const item = await TipoItemService.getItemFullStructureByName(metadados);
    if (!item) return response(null, true, `Tipo de item Inexiste`);

    let itens;
    //Get Overall Itens or from the logged user only
    if (fromLoggedUser) {
        itens = await ItemService.getItensByItemBaseByColaborador(item.tipoItem.id, fromLoggedUser);
        if (itens.error) return response(null, true, itens.msg, itens.code);
    } else {
        itens = await ItemService.getItensByItemBase(item.tipoItem.id);
        if (itens.error) return response(null, true, itens.msg, itens.code);
    }

    let metaObj = [];

    for (const itemSingle of itens) {
        const dataFormatted = await recursiveItemData(itemSingle, fromLoggedUser);
        metaObj.push({
            id: itemSingle.id,
            nome: item.tipoItem.nome,
            tipoId: item.tipoItem.id,
            components: dataFormatted
        });
    }

    return (metaObj.length == 1) ? metaObj[0] : metaObj;
}

export const registerMetadado = async (name, conteudo, userId) => {
    const Colaborador = await getColaboradorByUserId(userId);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    if (!conteudo) return response(null, true, `Informe o conteudo de "${name}"`);

    const conteudoArray = JSON.parse(conteudo);
    if (!Array.isArray(conteudoArray)) return response(null, true, "Informe o conteudo em um formato valido");

    let dadoAdd = [];
    conteudoArray.forEach((item) => {
        dadoAdd.push({ TipoDeDado: item.id, Conteudo: item.text })
    });

    const itemExist = await TipoItemService.getItemFullStructureByName(name);
    if (!itemExist) return response(null, true, `Tipo de item "${name}" não existe`);

    const registerDado = await dadoService.addDado(dadoAdd);
    if (registerDado.error) return response(null, true, registerDado.msg, registerDado.code);

    let instanciaAdd = [];
    registerDado.data.forEach((dadoSingle) => {
        const instanciaBody = itemExist.estrutura.filter(item => item.dadoDependente == dadoSingle.TipoDeDado)[0];
        instanciaAdd.push({ dado: dadoSingle.id, metaEstrutura: instanciaBody.id });
    })

    const registerMetaInstancia = await metaInstanciaService.addMetaInstancia(instanciaAdd);
    if (registerMetaInstancia.error) return response(null, true, registerMetaInstancia.msg, registerMetaInstancia.code);

    let itemInstanciaIds = registerMetaInstancia.map(item => item.id);
    const registerItem = await ItemService.addItem({ criador: Colaborador.id, elem: itemInstanciaIds, item: itemExist.tipoItem.id });
    if (registerItem.error) return response(null, true, registerItem.msg, registerItem.code);

    return response(registerItem.data);
}

export const registerMetadadoItem = async (name, conteudo, userId) => {
    const Colaborador = await getColaboradorByUserId(userId);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    if (!conteudo) return response(null, true, `Informe o conteudo de "${name}"`);

    const conteudoArray = JSON.parse(conteudo);
    if (!Array.isArray(conteudoArray)) return response(null, true, "Informe o conteudo em um formato valido");

    const itemExist = await TipoItemService.getItemFullStructureByName(name);
    if (!itemExist) return response(null, true, `Tipo de item "${name}" não existe`);

    const registerItem = await ItemService.addItem({ criador: Colaborador.id, depende_de: conteudoArray, item: itemExist.tipoItem.id });
    if (registerItem.error) return response(null, true, registerItem.msg, registerItem.code);

    return response(registerItem.data);
}

export const deleteMetadado = async (id, colId) => {
    const itemInstancias = await ItemService.getItensByItemId(id);
    const metaInstancias = await metaInstanciaService.getMetaInstanciaByIdsExpand(itemInstancias[0].elem);

    const deleteMetaInstanciaIds = metaInstancias.map(i => i.id);
    const deleteDadoIds = metaInstancias.map(i => i.dado.id);

    const deleteMetaInstancia = await metaInstanciaService.deleteMetaInstanciaIn(deleteMetaInstanciaIds);
    const deleteDado = await dadoService.deleteDadoIn(deleteDadoIds);

    let itensByCol = await ItemService.getItensByColaborador(colId);
    let algo = [];
    if (itensByCol.length > 0) {
        for (const item of itensByCol) {
            if (item.depende_de != null) {
                let depende_deArray = String(item.depende_de).split(',').map(Number);

                if (depende_deArray.includes(parseInt(id))) {
                    depende_deArray = depende_deArray.filter(d => d != id);
                    
                    const updateMetadado = await ItemService.updateItemById({depende_de:depende_deArray}, item.id);
                    if (updateMetadado.error) return response(null, true, updateMetadado.msg, updateMetadado.code);
                }
            }
        }
    }

    const { depende_de } = itemInstancias[0];

    if (depende_de != undefined) {
        let depende_deList = String(depende_de).split(',').map(Number);
        for (const itemDependente of depende_deList) {
            const recursiveCall = await deleteMetadado(itemDependente, colId);
        }
    }

    const { data, error, msg, code } = await ItemService.deleteItemById(id);
    if (error && code == "23503") return response(null, true, "Não é possivel apagar esse item", code);
    if (error) return response(null, true, msg, code);

    return true;
}

export const updateMetadadoItem = async (name, conteudo, userId, itemId, overlap = false) => {
    const Colaborador = await getColaboradorByUserId(userId);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    if (!conteudo) return response(null, true, `Informe o conteudo de "${name}"`);

    const itemExist = await TipoItemService.getItemFullStructureByName(name);
    if (!itemExist) return response(null, true, `Tipo de item "${name}" não existe`);

    const updateItem = await ItemService.getItensByItemId(itemId);

    if (updateItem[0].depende_de && updateItem[0].depende_de != null && !overlap) {
        const dependeDeArray = String(updateItem[0].depende_de).split(',').map(Number);
        conteudo.push(...dependeDeArray);
    }

    const update = await ItemService.updateItemById({ depende_de: conteudo }, itemId);
    if (update.error) return response(null, true, update.msg, update.code);

    return response(updateItem[0]);
}

export const editMetaDado = async (id, conteudo) => {
    const itemInstancias = await ItemService.getItensByItemId(id);
    const metaInstancias = await metaInstanciaService.getMetaInstanciaByIdsExpand(itemInstancias[0].elem);

    const editData = JSON.parse(conteudo);

    let bodyStr = [];

    editData.forEach((item) => {
        const editInstance = metaInstancias.filter(metaIn => metaIn.dado.TipoDeDado.id == item.id)[0];

        bodyStr.push({
            where: editInstance.dado.id,
            newData: item.text
        });
    });

    const editDados = await dadoService.editDadoList(bodyStr);

    return editDados;
}

export const formatForca = (metadado, type = "Força") => {
    let aux = [];

    metadado.forEach(chunks => {
        let temp = {};
        chunks.forEach((item, i) => {
            if (i == 0) {
                temp = { ...temp, itemId: item.itemId }
            }

            if (item.dado === "Nome") {
                temp = { ...temp, itemId: item.itemId, nome: { id: item.dadoId, content: item.content }, type }
            }

            if (item.dado === "Descrição") {
                temp = { ...temp, descricao: { id: item.dadoId, content: item.content } }
            }
        })
        aux.push(temp);
    });

    return aux;
}

globalThis.ObjetivosFormat = (metadado) => {
    return formatForca(metadado, "Objetivos");
}

globalThis.CicloFormat = (metadado) => {
    let aux = [];

    metadado.forEach(chunks => {
        let temp = {};
        chunks.forEach((item, i) => {
            if (item.dado === "Nome") {
                temp = { ...temp, itemId: item.itemId, label: item.content, type: "Ciclo" }
            }

            if (item.dado === "Data de início") {
                temp = { ...temp, from: item.content }
            }

            if (item.dado === "Data final") {
                temp = { ...temp, to: item.content }
            }
        })
        aux.push(temp);
    });

    return aux;
}

export const formatResultado = async (metadado) => {
    let aux = [];
    let finaObj = {
        meta: "Resultados",
        item: metadado[0]
    }

    // let i = 0;
    // for (const item of metadado) {
    //     const el = await formatVerify(item[i]);
    //     aux.push(el);
    //     i++;
    // }

    return finaObj;
}

export const formatVerify = async (metadado) => {
    if (metadado.length == 0) return false;

    // const item = metadado[0][0].itemId;

    return metadado;

    const itemInstancia = await ItemService.getItensByItemId(item);
    if (!itemInstancia) return false;

    const tipoItem = await TipoItemService.getItemById(itemInstancia[0].item);
    if (!tipoItem) return false;

    const func = tipoItem.nome + "Format";

    return metadado;
    return globalThis[func](metadado);
}

const recursiveItemData = async (item, fromLoggedUser = false) => {
    const instancia = await metaInstanciaService.getMetaInstanciaByIdsExpand(item.elem);

    let itensList = [];
    instancia.forEach((itemInstancia) => {
        itensList.push({
            dadoId: itemInstancia.dado.TipoDeDado.id,
            dado: itemInstancia.dado.TipoDeDado.nomedodado,
            content: itemInstancia.dado.Conteudo,
            html: itemInstancia.dado.TipoDeDado.campohtml,
            ordem: itemInstancia.metaEstrutura.ordem
        });
    });

    const { depende_de } = item;

    if (depende_de != undefined) {
        for (const itemDependente of depende_de) {
            const itemData = await ItemService.getItensByItemId(itemDependente);
            const recursiveCall = await recursiveItemData(itemData[0], fromLoggedUser);

            itensList.push(recursiveCall);
        }
    }

    itensList.sort((a, b) => a.ordem - b.ordem);

    const itemInfo = await TipoItemService.getItemById(item.item);
    return {
        id: item.id,
        nome: itemInfo.nome,
        dados: itensList
    }
}
