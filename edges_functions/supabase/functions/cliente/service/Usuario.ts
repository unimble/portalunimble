import { supaCli } from "../../utils/supaClient.ts";
import { response, parseBase64 } from "../../utils/utils.ts";

export const registerUsuario = async (name, email, id) => {
    const { data, error } = await supaCli.from("Usuario").insert([{ nome: name, email: email, empresas: [], googleid: id }]).select("*");

    if (error != null) return error;

    return data[0];
}

export const editUsuarioById = async (content, id) => {
    const { data, error } = await supaCli.from("Usuario").update(content).eq("id", id);

    if (error != null) return false;

    return true;
}

export const getUsuarioById = async (id: string) => {
    const { data, error } = await supaCli.from("Usuario").select("*").eq("id", id);

    if (error != null) return false;

    return data[0];
}

export const getUsuarioByEmail = async (email: string) => {
    const { data, error } = await supaCli.from("Usuario").select("*").eq("email", email);

    if (error != null) return false;

    return data[0];
}

export const uploadImageProfile = async (base64: string) => {
    const { blob, contentType } = parseBase64(base64);
    const extension = contentType.split('/')[1];
    const fileName = `${Date.now()}.${extension}`;

    const { data, error } = await supaCli.storage
        .from('profilepics')
        .upload(fileName, blob, {
            upsert: true,
        });

    if (error != null) return error;

    const url = supaCli
        .storage
        .from('profilepics')
        .getPublicUrl(fileName);

    return url.data.publicUrl;
}

export const deleteUserProfile = async (url: string) => {
    let fileName = url.split("/");
    fileName = fileName[fileName.length - 1];

    const { data, error } = await supaCli.storage
        .from('profilepics')
        .remove([fileName])

    if (error != null) return false;

    return true;
}