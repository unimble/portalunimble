import { supaCli } from "../../utils/supaClient.ts";
import { response } from "../../utils/utils.ts";

export const getDefaultPermission = async () => {
    const { data, error } = await supaCli.from("Permissao").select("*").eq("padrão", "TRUE");

    if (error != null) return false;

    return data[0];
}

export const addDefaultPermission = async (perfilId) => {
    const permission = await getDefaultPermission();

    const { data, error } = await supaCli.from("Perfil-Permissao").insert([{ perfil: perfilId, permissao: permission.id, autorizado: "TRUE" }]).select("*");

    if (error != null) return error;

    return error;
}