import { supaCli } from "../../utils/supaClient.ts";
import { response } from "../../utils/utils.ts";

export const registerColaborador = async (usuario: string, perfil: string, user_id: string) => {
    const { data, error } = await supaCli.from("Colaborador").insert([{ usuario: usuario, perfil: perfil, user_id: user_id }]).select("*");

    if (error != null) return false;

    return data[0];
}

export const getColaboradorByUserId = async (user_id: string) => {
    const { data, error } = await supaCli.from("Colaborador").select("*").eq("user_id", user_id);

    if (error != null) return false;

    return data[0];
}