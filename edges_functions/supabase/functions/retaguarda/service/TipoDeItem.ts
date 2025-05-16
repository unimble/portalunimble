import { supaCli } from "../../utils/supaClient.ts";
import { response } from "../../utils/utils.ts";

import { getByItemId, getByItemIdExpand, editMetaEstrutura } from "./MetaEstrutura.ts";

export const addTipoItem = async (name, meta) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const itemExist = await getItemByName(name);

    if (itemExist) return response(null, true, `Tipo de item ${name} já existe`);

    const { data, error } = await supaCli.from("TipoDeItem").insert([{ nome: name }]).select("*");

    if (error != null) return response(null, true, error.message, error.code);

    let objReturn = { tipodeitem: data[0] };

    if (meta) {
        let metaList = Array.isArray(meta) ? meta : JSON.parse(meta);
        const orderCheck = metaList.map(item => item.order);
        const uniqueOrders = new Set(orderCheck);

        if (uniqueOrders.size !== orderCheck.length) return response(null, true, "Meta dados não podem ter ordens iguais!");

        const metaData = await addItemModel(metaList, data[0].id);

        objReturn = { ...objReturn, meta: metaData }
    }

    return response(objReturn);
}

export const editStructure = async (meta, idItem) => {
    let metaList = Array.isArray(meta) ? meta : JSON.parse(meta);
    const orderCheck = metaList.map(item => item.order);
    const uniqueOrders = new Set(orderCheck);

    if (uniqueOrders.size !== orderCheck.length) return response(null, true, "Meta dados não podem ter ordens iguais!");

    const originalStructure = metaList.filter(item => item.original === true);
    const newStructure = metaList.filter(item => item.original === false);

    const getOriginal = await getByItemIdExpand(idItem);

    for (const item of getOriginal) {
        let order = -1;
        let button = null;

        if (item.dadoDependente) {
            order = originalStructure.filter(str => str.id == item.dadoDependente.id)[0].order;
        } else {
            order = originalStructure.filter(str => str.id == item.itemDependente.id)[0].order;
            button = originalStructure.filter(str => str.id == item.itemDependente.id)[0].button ?? false;
        }

        if (order >= 0) {
            await editMetaEstrutura(item.id, { ordem: order, isButton:button });
        }
    }
    
    if (newStructure.length > 0) {
        await addItemModel(newStructure, idItem);
    }

    return response(true);
}

export const addItemModel = async (meta, idItem) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    let addObj = [];

    meta.forEach((item, i) => {
        let row = { itemBase: idItem, ordem: item.order, isButton: item.button ?? false };

        if (item.type == "Item") {
            row = { ...row, itemDependente: item.id }
        } else {
            row = { ...row, dadoDependente: item.id }
        }

        addObj.push(row);
    })

    const { data, error } = await supaCli.from("MetaEstrutura").insert(addObj).select("*");

    if (error != null) return false;

    return data;
}

export const editTipoItem = async (id, name, meta) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("TipoDeItem").update({ nome: name }).eq("id", id).select("*");

    if (error != null) return response(null, true, error.message, error.code);

    return data[0];
}

export const getItemByName = async (name) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("TipoDeItem").select("*").eq("nome", name);

    if (error != null || !data) return false;

    return data[0];
}

export const getItemById = async (id) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("TipoDeItem").select("*").eq("id", id);

    if (error != null || !data) return false;

    return data[0];
}

export const getItemFullStructureByName = async (name) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("TipoDeItem").select("*").eq("nome", name);

    if (error != null || data.length == 0) return false;

    const metaEstrutura = await getByItemId(data[0].id);

    if (metaEstrutura.error) return false;

    return {
        tipoItem: data[0],
        estrutura: metaEstrutura
    };
}

export const deleteItemById = async (id) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("TipoDeItem").delete().eq("id", id);

    if (error != null) return response(null, true, error.message, error.code);

    return response({});
}