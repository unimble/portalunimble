import { supaCli } from "../../utils/supaClient.ts";
import { response } from "../../utils/utils.ts";

//services
import { registerPerfil } from "./Perfil.ts";
import { addDefaultPermission } from "./Permissao.ts";
import { registerColaborador, getColaboradorByUserId } from "./Colaborador.ts";
import { registerEmpresa } from "./Empresa.ts";
import { registerEquipe } from "./Equipe.ts";

export const registerUser = async (user) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");
    const { user_metadata, id } = user;

    //Verify if user already exists
    const alreadyExists = await getColaboradorByUserId(id);
    if(alreadyExists) return response(null, true, "Esse usuario já existe no sistema");

    //Adding User from Token
    const { data, error } = await supaCli.from("Usuario").insert([{ nome: user_metadata.name, email: user_metadata.email, empresas: [], googleid: user_metadata.provider_id }]).select("*");

    if (error != null) return response(null, true, "Erro ao cadastrar Usuario");

    //Adding a new perfil to user based on his name
    const perfilId = await registerPerfil(user_metadata.name) as string;
    if (!perfilId) return response(null, true, "Erro ao cadastrar Usuario");

    //Associating Default Permission to new account
    const addPermission = await addDefaultPermission(perfilId);

    //Adding new user as a Colaborador
    const addColaborador = await registerColaborador(data[0].id, perfilId, id);
    if (!addColaborador) return response(null, true, "Erro ao cadastrar Usuario");

    //Adding a first  generic company to new user
    const empresaDefaultName = `Empresa de ${user_metadata.name}`;
    const addEmpresa = await registerEmpresa(empresaDefaultName, addColaborador.id);
    if (!addEmpresa) return response(null, true, "Erro ao cadastrar Usuario");

    //Adding a first generic team to new user
    const equipeDefaultName = `Equipe 1`;
    const addEquipe = await registerEquipe(equipeDefaultName, addColaborador.id, addEmpresa.id);
    if (!addEquipe) return response(null, true, "Erro ao cadastrar Usuario");

    return response({
        colaborador: addColaborador,
        empresa: addEmpresa,
        usuario: data[0],
        equipes: addEquipe
    });
}