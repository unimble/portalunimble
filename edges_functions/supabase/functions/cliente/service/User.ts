import { supaCli } from "../../utils/supaClient.ts";
import { response } from "../../utils/utils.ts";

//services
import { getDefaultPerfil, getPerfilById, getInvitePerfil } from "./Perfil.ts";
import { getUserPermissions } from "./Permissao.ts";
import { registerColaborador, getColaboradorByUserId, getColaboradorByEmail, getColaboradorById, editEmpresa } from "./Colaborador.ts";
import { registerEmpresa, getEmpresaByColaboradorId } from "./Empresa.ts";
import { registerEquipe, getEquipesByColaboradorId, associateEquipeToColaborador, getEquipesById, updateEquipe } from "./Equipe.ts";
import { registerUsuario, getUsuarioById } from "./Usuario.ts";

import { getConviteByEmail, removeByEmail } from "./Convites.ts";

export const registerUser = async (user) => {
    if (!supaCli) return response(null, true, "Conexão com supabase falhou em iniciar");
    const { user_metadata, id, app_metadata } = user;

    //If user already exist return all data
    const alreadyExists = await getColaboradorByUserId(id);
    if (alreadyExists) {
        const { data } = await fetchAllUserData(id);
        return response(data);
    }

    //Verify if user is invited or adm
    const verifyInvite = await getConviteByEmail(user_metadata.email);

    //Adding User from Token
    let usuario;
    if (app_metadata.provider == "email") {
        usuario = await registerUsuario("New user", user_metadata.email, "") as string;
        if (!usuario) return response(usuario, true, "Erro ao cadastrar Usuario");
    } else {
        usuario = await registerUsuario(user_metadata.name, user_metadata.email, user_metadata.provider_id) as string;
        if (!usuario) return response(usuario, true, "Erro ao cadastrar Usuario");
    }

    if (verifyInvite.data.length == 0) {
        //getting Default Perfil
        const defaultPerfil = await getDefaultPerfil();

        //Adding new user as a Colaborador
        const addColaborador = await registerColaborador({ usuario: usuario.id, perfil: defaultPerfil.id, user_id: id });
        if (!addColaborador) return response(null, true, "Erro ao cadastrar Usuario");

        //Adding a initial generic company to new user
        const empresaDefaultName = `Empresa de ${(user_metadata.name) ? user_metadata.name : "new user"}`;
        const addEmpresa = await registerEmpresa(empresaDefaultName, addColaborador.id);
        if (!addEmpresa) return response(null, true, "Erro ao cadastrar Usuario");

        //editing Colaborador setting empresa id
        await editEmpresa(id, addEmpresa.id);

        //Adding a initial generic team to new user
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
    } else {
        //getting host data
        const colaborador = await getColaboradorById(verifyInvite.data[0].anfitriao);

        //getting Default Perfil
        const invitePerfil = await getInvitePerfil();

        //Adding invited user as a Colaborador
        const addColaborador = await registerColaborador({ usuario: usuario.id, perfil: invitePerfil.id, user_id: id, empresa: colaborador.empresa });
        if (!addColaborador) return response(null, true, "Erro ao cadastrar Usuario");

        //Getting correct team
        const [teamInvite] = await getEquipesById(verifyInvite.data[0].equipe);
        const teamMembers = Array.isArray(teamInvite.colaboradores) ? teamInvite.colaboradores : JSON.parse(teamInvite.colaboradores);

        //Pushing the invited user to the team
        teamMembers.push(addColaborador.id);

        const editTeam = await updateEquipe({ colaboradores: teamMembers }, teamInvite.id);
        if (!addColaborador) return response(null, true, "Erro ao cadastrar Usuario");

        //Associating Team with colaborador
        const colaboradorEquipe = await associateEquipeToColaborador(addColaborador.id, verifyInvite.data[0].equipe);
        if (!colaboradorEquipe) return response(null, true, "Erro ao cadastrar Usuario");

        const { data } = await fetchAllUserData(id);
        return response(data);
    }
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

export const recoveryPassword = async (email, senha) => {
    const alreadyExists = await getColaboradorByEmail(email);

    if (!alreadyExists) return response(null, true, "Usuario com esse e-mail não existe");

    const { data, error } = await supaCli.auth.admin.updateUserById(
        alreadyExists.user_id,
        { password: senha }
    )

    if(error) return response(error);

    return response({})
}