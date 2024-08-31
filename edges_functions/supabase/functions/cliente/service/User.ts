import { supaCli } from "../../utils/supaClient.ts";
import { response } from "../../utils/utils.ts";

//services
import { getDefaultPerfil, getPerfilById } from "./Perfil.ts";
import { getUserPermissions } from "./Permissao.ts";
import { registerColaborador, getColaboradorByUserId } from "./Colaborador.ts";
import { registerEmpresa, getEmpresaByColaboradorId } from "./Empresa.ts";
import { registerEquipe, getEquipesByColaboradorId, associateEquipeToColaborador } from "./Equipe.ts";
import { registerUsuario, getUsuarioById } from "./Usuario.ts";

export const registerUser = async (user) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");
    const { user_metadata, id } = user;

    //Verify if user already exists
    const alreadyExists = await getColaboradorByUserId(id);

    if (alreadyExists) {
        const { data } = await fetchAllUserData(id);
        return response(data);
    }

    //Adding User from Token
    const usuario = await registerUsuario(user_metadata.name, user_metadata.email, user_metadata.provider_id) as string;
    if (!usuario) return response(null, true, "Erro ao cadastrar Usuario");

    //getting Default Perfil
    const defaultPerfil = await getDefaultPerfil();

    //Adding new user as a Colaborador
    const addColaborador = await registerColaborador(usuario.id, defaultPerfil.id, id);
    if (!addColaborador) return response(null, true, "Erro ao cadastrar Usuario");

    //Adding a first  generic company to new user
    const empresaDefaultName = `Empresa de ${user_metadata.name}`;
    const addEmpresa = await registerEmpresa(empresaDefaultName, addColaborador.id);
    if (!addEmpresa) return response(null, true, "Erro ao cadastrar Usuario");

    //Adding a first generic team to new user
    const equipeDefaultName = `Equipe 1`;
    const addEquipe = await registerEquipe(equipeDefaultName, addColaborador.id, addEmpresa.id);
    if (!addEquipe) return response(null, true, "Erro ao cadastrar Usuario");

    //Associating Team with colaborador
    const colaboradorEquipe = await associateEquipeToColaborador(addColaborador.id, addEquipe[0].id);
    if (!colaboradorEquipe) return response(null, true, "Erro ao cadastrar Usuario");

    return response({
        colaborador: addColaborador,
        empresa: addEmpresa,
        usuario: usuario,
        equipes: addEquipe,
        perfil: defaultPerfil,
    });
}

export const fetchAllUserData = async (id) => {

    try {
        const colaborador = await getColaboradorByUserId(id);
        const empresa = await getEmpresaByColaboradorId(colaborador.id);
        const usuario = await getUsuarioById(colaborador.usuario);
        const equipes = await getEquipesByColaboradorId(colaborador.id);
        const permissoes = await getUserPermissions(colaborador.perfil);
        const perfil = await getPerfilById(colaborador.perfil);

        return response({
            colaborador,
            empresa,
            usuario,
            equipes,
            permissoes,
            perfil,
        });
    } catch (e) {
        return false;
    }
}