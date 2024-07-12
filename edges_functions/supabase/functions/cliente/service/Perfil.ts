import { supaCli } from "../../utils/supaClient.ts";
import { response } from "../../utils/utils.ts";

export const registerPerfil = async (name: string) => {
    const { data, error } = await supaCli.from("Perfil").insert([{ nome: name }]).select();

    if (error != null) return false;

    return data[0].id;
}