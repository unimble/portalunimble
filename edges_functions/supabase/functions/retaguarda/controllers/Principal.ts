import { response, isNumber } from "../../utils/utils.ts";
import * as service from "../service/TipoDeDado.ts";

import * as MetaDadosService from "../service/MetaDados.ts";

import {updateAllByTeamId} from "../service/Item.ts";
import { getColaboradorByUserId, getColaboradorByUserIdExpand, getColaboradorByUserIdExpandIn, getColaboradorByUsuario } from "../../cliente/service/Colaborador.ts";
import { getEmpresaByColaboradorId, getEmpresaById } from "../../cliente/service/Empresa.ts";
import { getEquipesColaboradorIsIn,
         getEquipesByColaboradorIdAndName,
         registerEquipe,
         getEquipesById,
         getmembros,
         updateEquipe,
         associateEquipeToColaborador,
         verifyEquipe,
         getEquipesByColaboradorId,
         removeAllColaboradorFromEquipe, 
         deleteEquipeById, 
         removeColaboradorFromOneEquipe } from "../../cliente/service/Equipe.ts";
import { addConvite, getConviteByEquipe,removeByEquipe } from "../../cliente/service/Convites.ts";
import { getUsuarioByEmail } from "../../cliente/service/Usuario.ts";

export const getHomeData = async (params, body, user) => {
    const { id } = params;

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    let empresa = await getEmpresaById(Colaborador.empresa);

    return response({
        userName: Colaborador.usuario.nome,
        role: Colaborador.perfil.nome,
        created: Colaborador.created_at,
        empresaName: empresa[0].nome,
        urgencia: empresa[0].urgencia,
        profile: Colaborador.usuario.profile
    });
}

export const getEquipe = async (params, body, user) => {
    const { id } = params;

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    let equipes = await getEquipesColaboradorIsIn([Colaborador.id]);
    if (!equipes) return response(null, true, `Equipe não existe`);

    let obj = [];
    //getting member name
    for (const equipe of equipes) {
        const users = await getColaboradorByUserIdExpandIn(equipe.colaboradores);

        obj.push({
            id: equipe.id,
            equipe: equipe.nome,
            criador: equipe.criador_equipe,
            empresa: equipe.empresa,
            users
        });
    }

    return response(obj);
}

export const getEquipeMembros = async (params, body, user) => {
    const { id } = params;

    let equipes = await getmembros(id);

    return response(equipes);
}

export const getEquipePendente = async (params, body, user) => {
    const { id } = params;

    let invite = await getConviteByEquipe(id);
    if (!invite) return response(null, true, `Convite não existe`);

    return response(invite.data);
}

export const addTeam = async (params, body, user) => {
    const { name } = body;

    if (name.length == 0) return response(null, true, `Campo de nome vazio!`);

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    const [empresa] = await getEmpresaByColaboradorId(Colaborador.id);
    if (!empresa) return response(null, true, `Colaborador não faz parte de uma empresa!`);

    let equipes = await getEquipesByColaboradorIdAndName(Colaborador.id, name);
    if (equipes.length != 0) return response(null, true, `Equipe "${name}" já existe`);

    let addEquipe = await registerEquipe(name, Colaborador.id, empresa.id);
    if (!addEquipe) return response(null, true, `Erro ao adicionar equipe!`);

    const colaboradorEquipe = await associateEquipeToColaborador(Colaborador.id, addEquipe[0].id);
    if (!colaboradorEquipe) return response(null, true, "Erro ao adicionar equipe");

    return response(addEquipe);
}

export const editEquipe = async (params, body, user) => {
    const { teamId } = params;
    const { name } = body;

    if (name.length == 0) return response(null, true, `Campo de nome não pode ser vazio!`);

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    let equipes = await getEquipesByColaboradorId(Colaborador.id);
    const equipeToEdit = equipes.filter(item => item.id == teamId)[0];

    if (!equipeToEdit) return response(null, true, `Você não tem permissão para editar essa equipe`);

    let edit = await updateEquipe({ nome: name }, teamId);
    if (!edit) return response(null, true, `Erro ao editar equipe`);

    return response(true);
}

export const delEquipe = async (params, body, user) => {
    const { teamId } = params;

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    let equipes = await getEquipesByColaboradorId(Colaborador.id);
    const equipeToDelete = equipes.filter(item => item.id == teamId)[0];

    if (!equipeToDelete) return response(null, true, `Você não tem permissão para deletar essa equipe`);

    await updateAllByTeamId({ equipe: null }, teamId);
    await removeAllColaboradorFromEquipe(teamId);
    await removeByEquipe(teamId);
    await deleteEquipeById(teamId);


    return response(true);
}

export const removeUserFromTeam = async (params, body, user) => {
    const { teamId, colId } = params;

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    let equipes = await getEquipesByColaboradorId(Colaborador.id);
    const equipeToDelete = equipes.filter(item => item.id == teamId)[0];

    if (!equipeToDelete) return response(null, true, `Você não tem permissão para realizar essa ação`);

    if (colId == equipeToDelete.criador_equipe) return response(null, true, `Não é permitido remover dono da equipe`);

    const newTeam = equipeToDelete.colaboradores.filter(item => item !=colId);
    await removeColaboradorFromOneEquipe(colId, teamId);
    await updateEquipe({colaboradores: newTeam}, teamId);

    return response(true);
}

export const inviteMember = async (params, body, user) => {
    const { email, equipeId } = body;

    const emailList = Array.isArray(email) ? email : JSON.parse(email);

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    const equipe = await getEquipesById(equipeId);
    if (!equipe) return response(null, true, `Equipe não existe`);

    if (equipe[0].criador_equipe != Colaborador.id) return response(null, true, `Você não tem permissão para realizar essa ação`);

    let equipeRealId = equipe[0].id;
    let inviteAdd: { anfitriao: string, email: string, equipe: string }[] = [];

    for (let member of emailList) {
        const verifyIfExist = await getUsuarioByEmail(member.email);

        if (verifyIfExist) {
            const col = await getColaboradorByUsuario(verifyIfExist.id);

            const isAlreadyIn = await verifyEquipe(col.id, equipeId);

            if (isAlreadyIn && isAlreadyIn.length > 0) {
                return response(null, true, `E-mail ${member.email} já está inserido na equipe`);
            }

            const [teamInvite] = await getEquipesById(equipeRealId);
            const teamMembers = Array.isArray(teamInvite.colaboradores) ? teamInvite.colaboradores : JSON.parse(teamInvite.colaboradores);

            teamMembers.push(col.id);

            const editTeam = await updateEquipe({ colaboradores: teamMembers }, teamInvite.id);
            if (!editTeam) return response(null, true, "Erro ao cadastrar Usuario");

            await associateEquipeToColaborador(col.id, equipeRealId);
        } else {
            inviteAdd.push({ anfitriao: Colaborador.id, email: member.email, equipe: equipeRealId });
        }
    }

    if (inviteAdd.length > 0) {
        let invite = await addConvite(inviteAdd);
        if (!invite) return response(null, true, `Erro ao adicionar equipe!`);
    }

    return response({});
}