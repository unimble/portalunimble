import { response, isNumber } from "../../utils/utils.ts";
import * as service from "../service/TipoDeDado.ts";

import * as MetaDadosService from "../service/MetaDados.ts";

import { getColaboradorByUserId, getColaboradorByUserIdExpand, getColaboradorByUserIdExpandIn, getColaboradorByUsuario } from "../../cliente/service/Colaborador.ts";
import { getEmpresaByColaboradorId, getEmpresaById } from "../../cliente/service/Empresa.ts";
import { getEquipesColaboradorIsIn, getEquipesByColaboradorIdAndName, registerEquipe, getEquipesById, getmembros, updateEquipe, associateEquipeToColaborador } from "../../cliente/service/Equipe.ts";
import { addConvite, getConviteByEquipe } from "../../cliente/service/Convites.ts";
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
        urgencia: empresa[0].urgencia
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

export const inviteMember = async (params, body, user) => {
    const { email, equipeId } = body;

    const emailList = Array.isArray(email) ? email : JSON.parse(email);

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    const equipe = await getEquipesById(equipeId);
    if (!equipe) return response(null, true, `Equipe não existe`);

    let equipeRealId = equipe[0].id;
    let inviteAdd: { anfitriao: string, email: string, equipe: string }[] = [];

    for (let member of emailList) {
        const verifyIfExist = await getUsuarioByEmail(member.email);

        if (verifyIfExist) {
            const col = await getColaboradorByUsuario(verifyIfExist.id);

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