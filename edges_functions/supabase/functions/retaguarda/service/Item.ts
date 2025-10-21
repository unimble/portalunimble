import { supaCli } from "../../utils/supaClient.ts";
import { response, getNanoId } from "../../utils/utils.ts";

export const addItem = async (conteudo) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Item").insert([{...conteudo, mnemonico:getNanoId()}]).select("*");

    if (error != null) return response(null, true, error.message, error.code);

    return response(data[0]);
}

export const updateItemById = async (conteudo, id) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Item").update(conteudo).eq("id", id);

    if (error != null) return response(null, true, error.message, error.code);

    return true;
}

export const updateAllByTeamId = async (conteudo, id) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Item").update(conteudo).eq("equipe", id);

    if (error != null) return response(null, true, error.message, error.code);

    return true;
}

export const deleteItemById = async (id) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Item").delete().eq("id", id);

    if (error != null) return response(null, true, error.message, error.code);

    return response({});
}

export const getAll = async () => {
    const { data, error } = await supaCli.from("Item").select("*").is('mnemonico', null);

    if (error != null) return false;

    return data;
}

export const getItensByItemBase = async (id) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Item").select(`
        id,
        created_at,
        criador (
            usuario (
                nome,
                profile
            )
        ),
        equipe (
            id,
            nome
        ),
        empresa,
        depende_de,
        elem,
        item 
    `).eq("item", id);

    if (error != null) return response(null, true, error.message, error.code);

    return data;
}

export const getItensByUrl = async (url) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Item").select(`
        id,
        created_at,
        criador (
            usuario (
                nome,
                profile
            )
        ),
        equipe (
            id,
            nome
        ),
        empresa,
        depende_de,
        elem,
        item,
        mnemonico
    `).eq("mnemonico", url);

    if (error != null) return response(null, true, error.message, error.code);

    return data;
}

export const testee = async (id, base) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from('vw_item_data')
        .select(`
      item_id,
      created_at,
      criador (
        usuario (
          nome,
          profile
        )
      ),
      equipe (
        id,
        nome
      ),
      empresa,
      depende_de,
      elem_meta_instancia_ids,
      item_base,
      data
    `)
        .match({
            item_base: base,
        })
        .filter('data->>Nome', 'eq', id)

    if (error != null) return response(null, true, error.message, error.code);

    return data;
}

export const getProjectSum = async (id) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli
        .rpc('getProjectConclusion', { id });

    if (error != null) return response(null, true, error.message, error.code);

    return data;
}

export const getItensByItemId = async (id) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Item").select(`
        id,
        created_at,
        criador (
            usuario (
                nome,
                profile
            )
        ),
        equipe (
            id,
            nome
        ),
        empresa,
        depende_de,
        elem,
        item (
            id,
            nome,
            protegido
        ) 
    `).eq("id", id);

    if (error != null) return response(null, true, error.message, error.code);

    return data;
}

export const getItensByItemIdExpandTipoItem = async (id) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Item").select(`
        id,
        created_at,
        criador (
            usuario (
                nome,
                profile
            )
        ),
        equipe (
            id,
            nome
        ),
        empresa,
        depende_de,
        elem,
        item (
            id,
            nome
        )
    `).eq("id", id);

    if (error != null) return response(null, true, error.message, error.code);

    return data;
}

export const getItensByItemIdList = async (id) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Item").select(`
        id,
        created_at,
        criador (
            usuario (
                nome,
                profile
            )
        ),
        equipe (
            id,
            nome
        ),
        empresa,
        depende_de,
        elem,
        item 
    `).in("id", id);

    if (error != null) return response(null, true, error.message, error.code);

    return data;
}

export const getItensByItemBaseByColaborador = async (id, colId) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Item").select(`
        id,
        created_at,
        criador (
            usuario (
                nome,
                profile
            )
        ),
        equipe (
            id,
            nome
        ),
        empresa,
        depende_de,
        elem,
        item 
    `).eq("item", id).eq("criador", colId);

    if (error != null) return response(null, true, error.message, error.code);

    return data;
}

export const getItensIdsByColaborador = async (colId) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Item").select(`
        id
    `).eq("criador", colId);

    if (error != null) return response(null, true, error.message, error.code);

    return data;
}

export const getItensByItemBaseByAllColaborador = async (id, colId) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Item").select(`
        id,
        created_at,
        criador (
            usuario (
                nome,
                profile
            )
        ),
        equipe (
            id,
            nome
        ),
        empresa,
        depende_de,
        elem,
        item 
    `).eq("item", id).in("criador", colId);

    if (error != null) return response(null, true, error.message, error.code);

    return data;
}

export const getItensByItemBaseByEmpresa = async (id, companyId) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Item").select(`
        id,
        created_at,
        criador (
            usuario (
                nome,
                profile
            )
        ),
        equipe (
            id,
            nome
        ),
        empresa,
        depende_de,
        elem,
        item
    `).eq("item", id).eq("empresa", companyId);

    if (error != null) return response(null, true, error.message, error.code);

    return data;
}

export const getItensByColaborador = async (colId) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");

    const { data, error } = await supaCli.from("Item").select("*").eq("criador", colId);

    if (error != null) return response(null, true, error.message, error.code);

    return data;
}