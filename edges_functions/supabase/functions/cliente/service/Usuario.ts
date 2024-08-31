import { supaCli } from "../../utils/supaClient.ts";
import { response } from "../../utils/utils.ts";

export const registerUsuario = async (name, email, id) => {
    const { data, error } = await supaCli.from("Usuario").insert([{ nome: name, email: email, empresas: [], googleid: id }]).select("*");

    if (error != null) return false;

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