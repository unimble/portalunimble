import { supaCli } from "../../utils/supaClient.ts";
import { response } from "../../utils/utils.ts";

import * as dadoService from "./Dado.ts";
import * as TipoItemService from "./TipoDeItem.ts";
import * as ItemService from "./Item.ts";
import * as metaInstanciaService from "./MetaInstancia.ts";
import * as metaEstruturaService from "./MetaEstrutura.ts";

//cliente
import { getColaboradorByUserId } from "../../cliente/service/Colaborador.ts";
import { getAllAssociated, getAllEquipes } from "../../cliente/service/Equipe.ts";

var entrou = [];

function buildMetaTree(flatData, baseID) {
    const baseItens = flatData.filter(item => item.item_base == baseID);

    const builtList = [];
    for (const itemSingle of baseItens) {
        builtList.push({
            id: itemSingle.item_id,
            nome: itemSingle.item_nome,
            tipoId: itemSingle.item_base,
            data: itemSingle.data,
            dataId: itemSingle.dataid,
            createdBy: {
                name: itemSingle.criador_nome,
                profile: itemSingle.criador_avatar,
                origin: itemSingle.created_at
            },
            equipe: {
                id: itemSingle.equipe_id,
                nome: itemSingle.equipe_nome
            },
            components: recursiveTest(flatData, itemSingle.parent_ids)
        });
    }

    return builtList;
}

const recursiveTest = (flatData, parentsIds) => {
    if (parentsIds) {
        let baseItens = [];

        baseItens = flatData.filter(instance => parentsIds.includes(instance.item_id));

        const builtList = [];
        for (const itemSingle of baseItens) {
            const newFlatdata = flatData.map(instance => {
                if (!parentsIds.includes(instance.item_id)) {
                    return instance;
                }
            }).filter(instance => instance !== undefined);

            builtList.push({
                id: itemSingle.item_id,
                nome: itemSingle.item_nome,
                tipoId: itemSingle.item_base,
                data: itemSingle.data,
                dataId: itemSingle.dataid,
                createdBy: {
                    name: itemSingle.criador_nome,
                    profile: itemSingle.criador_avatar,
                    origin: itemSingle.created_at
                },
                equipe: {
                    id: itemSingle.equipe_id,
                    nome: itemSingle.equipe_nome
                },
                components: recursiveTest(newFlatdata, itemSingle.parent_ids)
            });
        }

        return builtList;
    }
}

export const getMetaDadosTemp = async (itemName: string, colaboradorId: number, kind = '', context = '', pag, filters = "") => {
    const item = await TipoItemService.getItemFullStructureByName(itemName);
    if (!item) return response(null, true, `Tipo de item Inexiste`);

    let params = {
        p_tipo_item_id: item.tipoItem.id,
        p_user_id: colaboradorId,
        p_context: (item.tipoItem.protegido === true) ? null : context || null,
        p_limit: pag?.perPage ? parseInt(pag?.perPage) : 50,
        p_offset: pag?.offset ? parseInt(pag?.offset) : 0
    };

    let total_params = {
        p_tipo_item_id: item.tipoItem.id,
        p_user_id: colaboradorId,
        p_context: (item.tipoItem.protegido === true) ? null : context || null,
    };

    if (filters != "") {
        params = { ...params, p_filtro: filters };
        total_params = { ...total_params, p_filtro: filters };
    }

    const total = await supaCli.rpc("get_metadados_count", total_params);
    const { data, error } = await supaCli.rpc("get_metadados", params);

    return { total: total.data, data: data ? buildMetaTree(data, item.tipoItem.id) : [] };
}

export const getMetaDadosAllTeams = async (itemName: string, colaboradorId: number, field_name = '', field_id = '', pag, filters = "") => {
    const item = await TipoItemService.getItemFullStructureByName(itemName);
    if (!item) return response(null, true, `Tipo de item Inexiste`);

    let p_filtro = `(data ->> '${field_name}') = '${field_id}' ${filters}`;


    const params = {
        p_tipo_item_id: item.tipoItem.id,
        p_user_id: colaboradorId,
        p_limit: pag.perPage ? parseInt(pag.perPage) : null,
        p_offset: pag.offset ? parseInt(pag.offset) : null,
        p_filtro
    };

    const total_params = {
        p_tipo_item_id: item.tipoItem.id,
        p_user_id: colaboradorId,
        p_filtro
    };

    const total = await supaCli.rpc("get_flat_item_metadata_allteams_total", total_params);
    const { data, error } = await supaCli.rpc("get_flat_item_metadata_allteams", params);

    if (!data) {
        return { total: error, data: [] }
    }

    return { total: total.data, data: buildMetaTree(data, item.tipoItem.id) };
}

export const getMetaDadosSingleTemp = async (itemName: string, colaboradorId: number, kind = '', id) => {
    const item = await TipoItemService.getItemFullStructureByName(itemName);

    if (!item) return response(null, true, `Tipo de item Inexiste`);

    const { data, error } = await supaCli
        .rpc('get_flat_item_metadata_by_id', {
            p_tipo_item_id: item.tipoItem.id,
            p_user_id: colaboradorId,
            p_kind: kind,
            i_id: id
        });

    const metaTree = buildMetaTree(data, item.tipoItem.id);

    return metaTree;
}


export const getKanbanStandard = async () => {
    let { data, error } = await supaCli
        .rpc('get_kanbans_padrao');
    if (error) return response(null, true, "Não foi possivel resgatar esse metadado");

    return data;
}

export const getMetaDados = async (metadados, source = false, kind = "col", itens = null) => {
    const item = await TipoItemService.getItemFullStructureByName(metadados);
    if (!item) return response(null, true, `Tipo de item Inexiste`);
    //Get Overall Itens or from the logged user only

    if (!source) {
        itens = await ItemService.getItensByItemBase(item.tipoItem.id);
        if (itens.error) return response(null, true, itens.msg, itens.code);
    } else if (source && kind == "col") {
        itens = await ItemService.getItensByItemBaseByColaborador(item.tipoItem.id, source);
        if (itens.error) return response(null, true, itens.msg, itens.code);
    } else if (source && kind == "company") {
        itens = await ItemService.getItensByItemBaseByEmpresa(item.tipoItem.id, source);
        if (itens.error) return response(null, true, itens.msg, itens.code);
    } else if (source && kind == "team") {
        const equipesMe = await getAllEquipes(source);
        if (!equipesMe) return response(null, true, "Erro inesperado");

        const ids = equipesMe.map(eq => eq.equipe);

        const associatedCol = await getAllAssociated(ids);
        if (!associatedCol) return response(null, true, "Erro inesperado");

        const idsItens = associatedCol.map(r => r.colaborador);

        itens = await ItemService.getItensByItemBaseByAllColaborador(item.tipoItem.id, idsItens);
        if (itens.error) return response(null, true, itens.msg, itens.code);
    }

    let metaObj: any = [];

    for (const itemSingle of itens) {
        const dataFormatted = await recursiveItemData(itemSingle, source);
        metaObj.push({
            id: itemSingle.id,
            nome: item.tipoItem.nome,
            tipoId: item.tipoItem.id,
            createdBy: {
                name: itemSingle.criador.usuario.nome,
                profile: itemSingle.criador.usuario.profile,
                origin: itemSingle.created_at
            },
            equipe: itemSingle.equipe,
            components: dataFormatted
        });
    }

    return (metaObj.length == 1) ? metaObj[0] : metaObj;
}

export const getMetaDadosById = async (metadados, id) => {
    const item = await TipoItemService.getItemFullStructureByName(metadados);
    if (!item) return response(null, true, `Tipo de item Inexiste`);

    const [itemSingle] = await ItemService.getItensByItemId(id);
    if (itemSingle.error) return response(null, true, itemSingle.msg, itemSingle.code);

    let metaObj: any = {};

    const dataFormatted = await recursiveItemData(itemSingle, false);
    metaObj = {
        id: itemSingle.id,
        nome: item.tipoItem.nome,
        tipoId: item.tipoItem.id,
        createdBy: {
            name: itemSingle.criador.usuario.nome,
            profile: itemSingle.criador.usuario.profile,
            origin: itemSingle.created_at
        },
        equipe: itemSingle.equipe,
        components: dataFormatted
    };

    return metaObj;
}

export const getMetaDadosForm = async (metadados) => {
    const item = await TipoItemService.getItemFullStructureByName(metadados);
    if (!item) return response(null, true, `Tipo de item inexistente`);

    const estrutura = await metaEstruturaService.getByItemIdExpand(item.tipoItem.id);
    if (!estrutura) return response(null, true, `Estrutura inexistente`);

    let final = [];

    for (const est of estrutura) {
        if (est.itemDependente) {
            // // Chama a função recursiva caso haja itemDependente
            const recursive = await recursiveItemForm(est.itemDependente.id);
            final.push({
                ...est, // Adiciona os dados do item atual
                dadoDependente: recursive // Adiciona a estrutura dependente
            });
        } else {
            final.push(est);
        }
    }

    final.sort((a, b) => a.ordem - b.ordem);

    return final;
};

export const getMetaDadosFormEdit = async (id) => {
    const item = await ItemService.getItensByItemId(id);
    if (!item) return response(null, true, `Tipo de item inexistente`);

    const estrutura = await metaInstanciaService.getMetaInstanciaByIdsExpand(item[0].elem);
    if (!estrutura) return response(null, true, `Estrutura inexistente`);

    let final = [];

    for (const est of estrutura) {
        final.push({
            html: est.dado.TipoDeDado.campohtml,
            conteudo: est.dado.Conteudo,
            ordem: est.metaEstrutura.ordem,
            idMetaEstrutura: est.metaEstrutura.id,
            idTipoDado: est.dado.TipoDeDado.id,
            createdAt: item[0].created_at,
            profile: item[0].criador,
            nomeDado: est.dado.TipoDeDado.nomedodado
        });
    }

    if (item[0].depende_de && item[0].depende_de.length > 0) {
        const dependeDeList = await ItemService.getItensByItemIdList(item[0].depende_de);
        if (!dependeDeList) return response(null, true, `Itens dependentes inexistentes`);

        const itemEstrutura = await metaEstruturaService.getByItemIdExpand(item[0].item);
        if (!itemEstrutura) return response(null, true, `Estrutura inexistente`);

        for (const dependeId of item[0].depende_de) {
            const subData = [];
            const dependente = dependeDeList.find(i => i.id === dependeId);

            if (!dependente || !dependente.elem) continue;

            const estruturaDependente = await metaInstanciaService.getMetaInstanciaByIdsExpand(dependente.elem);
            if (!estruturaDependente) continue;

            const tipoItemInfo = await TipoItemService.getItemById(dependente.item);

            for (const est of estruturaDependente) {
                subData.push({
                    html: est.dado.TipoDeDado.campohtml,
                    conteudo: est.dado.Conteudo,
                    ordem: est.metaEstrutura.ordem,
                    idMetaEstrutura: est.metaEstrutura.id,
                    idTipoDado: est.dado.TipoDeDado.id,
                    nomeDado: est.dado.TipoDeDado.nomedodado,
                    createdAt: dependente.created_at,
                    profile: dependente.criador,
                    origem: 'dependente',
                    dependeDeId: dependeId
                });
            }

            final.push({
                instanceId: dependeId,
                tipoItemName: tipoItemInfo.nome,
                createdAt: dependente.created_at,
                profile: dependente.criador,
                dados: subData
            })
        }
    }

    final.sort((a, b) => a.ordem - b.ordem);

    return final;
};

export const getMetaDadosFormEditNew = async (id, pag = []) => {

    const { data, error } = await supaCli
        .rpc('get_formedit', {
            p_instance_id: id,
            p_paginacoes: pag
        });

    let total = 0;

    if (pag.length > 0) {
        total = await supaCli
            .rpc('get_formedit_count', {
                p_instance_id: id,
                p_paginacoes: pag
            });

        if(!total.error){
            total = total.data;
        }
    }

    if (error) return response(null, true, `Erro ao recuperar formulario`);

    let final = [];

    for (const item of data) {
        let obj = {
            instanceId: item.id,
            tipoItemName: item.item.nome,
            createdAt: item.created_at,
            profile: item.criador,
            dados: []
        };

        let list = [];
        const { instancia } = item;

        for (const inst of instancia) {
            list.push({
                html: inst.dado.tipoDeDado.campohtml,
                conteudo: inst.dado.conteudo,
                ordem: inst.metaEstrutura.ordem,
                idMetaEstrutura: inst.metaEstrutura.id,
                idTipoDado: inst.dado.tipoDeDado.id,
                createdAt: item.created_at,
                profile: item.criador,
                nomeDado: inst.dado.tipoDeDado.nomedodado
            })
        }


        final.push({ ...obj, dados: list, principal: (item.id == id) });
    }

    return { final, total };
};


export const registerMetadado = async (name, conteudo = null, userId, equipeId = null) => {
    const Colaborador = await getColaboradorByUserId(userId);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    const itemExist = await TipoItemService.getItemFullStructureByName(name);
    if (!itemExist) return response(null, true, `Tipo de item "${name}" não existe`);

    if (!conteudo) {
        let obj = { criador: Colaborador.id, item: itemExist.tipoItem.id };

        if (equipeId) {
            obj = { ...obj, equipe: equipeId };
        }
        const registerItem = await ItemService.addItem(obj);
        if (registerItem.error) return response(null, true, registerItem.msg, registerItem.code);

        return response(registerItem.data);
    }

    const conteudoArray = (!Array.isArray(conteudo)) ? JSON.parse(conteudo) : conteudo;

    if (!Array.isArray(conteudoArray)) return response(null, true, "Informe o conteudo em um formato valido");

    let dadoAdd = [];
    conteudoArray.forEach((item) => {
        dadoAdd.push({ TipoDeDado: item.id, Conteudo: item.text })
    });

    const registerDado = await dadoService.addDado(dadoAdd);
    if (registerDado.error) return response(null, true, registerDado.msg, registerDado.code);

    let instanciaAdd = [];
    registerDado.data?.forEach((dadoSingle) => {
        const instanciaBody = itemExist.estrutura.filter(item => item.dadoDependente == dadoSingle.TipoDeDado)[0];
        instanciaAdd.push({ dado: dadoSingle.id, metaEstrutura: instanciaBody.id });
    })

    const registerMetaInstancia = await metaInstanciaService.addMetaInstancia(instanciaAdd);
    if (registerMetaInstancia.error) return response(null, true, registerMetaInstancia.msg, registerMetaInstancia.code);

    let itemInstanciaIds = registerMetaInstancia.map(item => item.id);

    let obj = { criador: Colaborador.id, elem: itemInstanciaIds, item: itemExist.tipoItem.id };

    if (equipeId) {
        obj = { ...obj, equipe: equipeId };
    }

    const registerItem = await ItemService.addItem(obj);
    if (registerItem.error) return response(null, true, registerItem.msg, registerItem.code);

    return response(registerItem.data);
}

export const registerMetadadoItem = async (name, conteudo, userId, equipe = null) => {
    const Colaborador = await getColaboradorByUserId(userId);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    if (!conteudo) return response(null, true, `Informe o conteudo de "${name}"`);

    const conteudoArray = (!Array.isArray(conteudo)) ? JSON.parse(conteudo) : conteudo;
    if (!Array.isArray(conteudoArray)) return response(null, true, "Informe o conteudo em um formato valido");

    const itemExist = await TipoItemService.getItemFullStructureByName(name);
    if (!itemExist) return response(null, true, `Tipo de item "${name}" não existe`);

    const registerItem = await ItemService.addItem({ criador: Colaborador.id, depende_de: conteudoArray, item: itemExist.tipoItem.id, empresa: Colaborador.empresa, equipe });
    if (registerItem.error) return response(null, true, registerItem.msg, registerItem.code);

    return response(registerItem.data);
}

export const deleteMetadadoAll = async (ids, colId) => {
    for (const id of ids) {
        await deleteMetadado(id, colId);
    }

    return response(true);
}

export const deleteMetadado = async (id, colId) => {
    const itemInstancias = await ItemService.getItensByItemId(id);
    const metaInstancias = await metaInstanciaService.getMetaInstanciaByIdsExpand(itemInstancias[0]?.elem);

    if (metaInstancias && itemInstancias[0].item.protegido != true) {
        const deleteMetaInstanciaIds = metaInstancias.map(i => i.id);
        const deleteDadoIds = metaInstancias.map(i => i.dado.id);

        const deleteMetaInstancia = await metaInstanciaService.deleteMetaInstanciaIn(deleteMetaInstanciaIds);
        const deleteDado = await dadoService.deleteDadoIn(deleteDadoIds);
    }

    let itensByCol = await ItemService.getItensByColaborador(colId);
    let algo = [];
    if (itensByCol.length > 0) {
        for (const item of itensByCol) {
            if (item.depende_de != null) {
                let depende_deArray = String(item.depende_de).split(',').map(Number);

                if (depende_deArray.includes(parseInt(id))) {
                    depende_deArray = depende_deArray.filter(d => d != id);

                    const updateMetadado = await ItemService.updateItemById({ depende_de: depende_deArray }, item.id);
                    if (updateMetadado.error) return response(null, true, updateMetadado.msg, updateMetadado.code);
                }
            }
        }
    }

    if (itemInstancias && itemInstancias.length > 0) {
        const { depende_de } = itemInstancias[0];

        if (depende_de != undefined) {
            let depende_deList = String(depende_de).split(',').map(Number);
            for (const itemDependente of depende_deList) {
                const recursiveCall = await deleteMetadado(itemDependente, colId);
            }
        }

        if (itemInstancias[0].item.protegido != true) {
            const { data, error, msg, code } = await ItemService.deleteItemById(id);
            if (error && code == "23503") return response(null, true, "Não é possivel apagar esse item", code);
            if (error) return response(null, true, msg, code);
        }
    }

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
        conteudo = String(conteudo).split(',').map(Number);
        conteudo = Array.from(new Set([...conteudo, ...dependeDeArray]));
    }

    const update = await ItemService.updateItemById({ depende_de: conteudo }, itemId);
    if (update.error) return response(null, true, update.msg, update.code);

    return response(update);
}

export const updateIntancia = async (name, conteudo, id) => {
    const conteudoArray = (!Array.isArray(conteudo)) ? JSON.parse(conteudo) : conteudo;

    if (!Array.isArray(conteudoArray)) return response(null, true, "Informe o conteudo em um formato valido");

    let dadoAdd = [];
    conteudoArray.forEach((item) => {
        if (item.text != null && item.text.toString().length > 0) dadoAdd.push({ TipoDeDado: item.id, Conteudo: item.text });
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

    const [itemSingle] = await ItemService.getItensByItemId(id);
    if (itemSingle.error) return response(null, true, itemSingle.msg, itemSingle.code);

    let itemInstanciaIds = registerMetaInstancia.map(item => item.id);
    const newElem = (Array.isArray(itemSingle.elem)) ? itemSingle.elem.concat(itemInstanciaIds) : itemInstanciaIds;

    const itemEdit = await ItemService.updateItemById({ elem: newElem }, id);
    if (itemEdit.error) return response(null, true, itemEdit.msg, itemEdit.code);

    return true;
}

export const editMetaDado = async (id, conteudo) => {
    const itemInstancias = await ItemService.getItensByItemId(id);
    const metaInstancias = await metaInstanciaService.getMetaInstanciaByIdsExpand(itemInstancias[0].elem);

    const editData = (!Array.isArray(conteudo)) ? JSON.parse(conteudo) : conteudo;

    let bodyStr = [];
    let notIncludedData = [];

    for (const item of editData) {
        const editInstance = metaInstancias.filter(metaIn => metaIn.dado.TipoDeDado.id == item.id)[0];

        if (editInstance) {
            bodyStr.push({
                where: editInstance.dado.id,
                newData: item.text
            });
        } else {
            if (item.text != null && item.text.toString().length > 0) {
                notIncludedData.push(item);
            }
        }
    };

    if (notIncludedData.length > 0) {
        const tipoItem = await TipoItemService.getItemById(itemInstancias[0].item.id);

        const updateInstancia = await updateIntancia(tipoItem.nome, notIncludedData, id);
        if (updateInstancia.error) return response(null, true, updateInstancia.msg, updateInstancia.code);
    }

    if (bodyStr.length > 0) {
        const editDados = await dadoService.editDadoList(bodyStr);

        return editDados;
    }

    return response({});
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

const recursiveItemData = async (item) => {
    const instancia = await metaInstanciaService.getMetaInstanciaByIdsExpand(item.elem);

    let itensList: any = [];
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
            const recursiveCall = await recursiveItemData(itemData[0]);

            itensList.push(recursiveCall);
        }
    }

    // itensList.sort((a, b) => a.ordem - b.ordem);

    const itemInfo = await TipoItemService.getItemById(item.item);
    return {
        id: item.id,
        nome: itemInfo.nome,
        dados: itensList,
        createdBy: {
            name: item.criador.usuario.nome,
            profile: item.criador.usuario.profile,
            origin: item.created_at
        }
    }
}

const recursiveItemForm = async (itemId) => {
    const estrutura = await metaEstruturaService.getByItemIdExpand(itemId);
    if (!estrutura) return response(null, true, `Estrutura inexistente para o item ${itemId}`);

    // Ordena a estrutura pela ordem definida
    estrutura.sort((a, b) => a.ordem - b.ordem);
    let result = [];

    for (const est of estrutura) {
        if (est.itemDependente) {
            // Chama a recursão novamente se houver um itemDependente
            const recursive = await recursiveItemForm(est.itemDependente.id);
            result.push({
                ...est, // Adiciona os dados do item atual
                dadoDependente: recursive // Adiciona os dados dependentes recursivamente
            });
        } else {
            result.push(est); // Adiciona diretamente se não houver dependente
        }
    }

    return result;
};

