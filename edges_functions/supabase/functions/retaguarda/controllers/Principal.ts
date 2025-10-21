import { response, isNumber, TEAM_OWNER, TEAM_ADM, TEAM_WORKER } from "../../utils/utils.ts";
import Email from "../../utils/email.ts";

import { updateAllByTeamId } from "../service/Item.ts";
import { inviteVerify as inviteVerifyLoader, getEquipe as getEquipeLoader, getAllForms, getMetaDadosAll } from "../service/loader.ts";
import { getColaboradorByEmail, getColaboradorByEmailExpand, getColaboradorByUserIdExpand, getColaboradorByUserIdExpandIn, getColaboradorByUsuario } from "../../cliente/service/Colaborador.ts";
import { getEmpresaByColaboradorId, getEmpresaById } from "../../cliente/service/Empresa.ts";
import {
    getEquipesColaboradorIsIn,
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
    removeColaboradorFromOneEquipe,
    updateEquipeMember,
    getUserPrevilege,
    updateEquipeToColaborador
} from "../../cliente/service/Equipe.ts";
import { addConvite, getConviteByEquipe, removeByEquipe, removeByEmail, getAll, getConviteByEmail, getConviteByEmailAndEquipe, removeById } from "../../cliente/service/Convites.ts";
import { getUsuarioByEmail } from "../../cliente/service/Usuario.ts";
import { registerUser } from "../../cliente/service/User.ts";

export const testeEnv = async (params, body, user) => {
    const sendEmail = await Email.send(
        "guilhermegdrag@gmail.com",
        "Bem-vindo à plataforma!",
        "Obrigado por se cadastrar. <b>HEHE</b>"
    )

    return response({
        result: sendEmail
    });
}

export const getHomeData = async (params, body, user) => {
    const { id } = params;

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    let empresa = await getEmpresaById(Colaborador.empresa);

    return response({
        userName: Colaborador.usuario.nome,
        email: Colaborador.usuario.email,
        role: Colaborador.perfil.nome,
        created: Colaborador.created_at,
        empresaName: empresa[0].nome,
        urgencia: empresa[0].urgencia,
        profile: Colaborador.usuario.profile
    });
}

export const getPageInfo = async (params: any, body: any, user: any, headers: any, query: any) => {
    const { type, page } = params;

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    await inviteVerifyLoader(Colaborador);

    const [userData, equipeData, formsData] = await Promise.all([
        registerUser(user),
        getEquipeLoader(Colaborador),
        getAllForms()
    ]);


    let respObj: any = {
        user: userData.data,
        equipe: equipeData.data,
        forms: formsData.data
    };

    const opt = page.split('?')[0];

    if (opt == "metas") {
        const [dados, ciclos] = await Promise.all([
            getMetaDadosAll(Colaborador, "Resultados", '', query, headers),
            getMetaDadosAll(Colaborador, "Ciclo", '', null, headers)
        ]);

        respObj = { ...respObj, itens: dados.data, ciclos: ciclos.data }
    }

    if (opt == "atas") {
        const [dados] = await Promise.all([
            getMetaDadosAll(Colaborador, "Atas", '', query, headers),
        ]);

        respObj = { ...respObj, itens: dados.data }
    }

    if (opt == "processos") {
        const [dados] = await Promise.all([
            getMetaDadosAll(Colaborador, "Processos", '', query, headers),
        ]);

        respObj = { ...respObj, itens: dados.data }
    }

    if (opt == "projetos") {
        const [dados] = await Promise.all([
            getMetaDadosAll(Colaborador, "Projeto", '', query, headers),
        ]);

        respObj = { ...respObj, itens: dados.data }
    }

    if (opt == "tarefas") {
        const [dados] = await Promise.all([
            getMetaDadosAll(Colaborador, "Tarefas", '', query, headers),
        ]);

        respObj = { ...respObj, itens: dados.data }
    }

    return response(respObj);
}

export const getEquipe = async (params, body, user, headers, query) => {
    const { id } = params;

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    const equipes = await getEquipesColaboradorIsIn([Colaborador.id], {
        perPage: query?.perPage,
        offset: query?.offset
    });

    if (!equipes) return response(null, true, `Equipe não existe`);

    const obj = await Promise.all(
        equipes.map(async (equipe) => {
            let users = await getColaboradorByUserIdExpandIn(equipe.colaboradores);

            users = await Promise.all(
                users.map(async (user) => {
                    const privilegio = await getUserPrevilege(equipe.id, user.id);

                    return {
                        ...user,
                        privilegio, // você pode adicionar a info aqui se quiser
                    };
                })
            );

            return {
                id: equipe.id,
                equipe: equipe.nome,
                urlId: equipe.mnemonico,
                criador: equipe.criador_equipe,
                empresa: equipe.empresa,
                users
            };
        })
    );

    obj.sort((a, b) => a.equipe.localeCompare(b.equipe, 'pt', { sensitivity: 'base' }));

    return response(obj);
};

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

    const colaboradorEquipe = await associateEquipeToColaborador(Colaborador.id, addEquipe[0].id, TEAM_OWNER);
    if (!colaboradorEquipe) return response(null, true, "Erro ao adicionar equipe");

    return response(addEquipe);
}

export const editEquipe = async (params, body, user) => {
    const { teamId } = params;
    const { name } = body;

    if (name.length == 0) return response(null, true, `Campo de nome não pode ser vazio!`);

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    //logged role
    let equipeData = await getUserPrevilege(teamId, Colaborador.id);
    if (!equipeData || equipeData?.privilegio < TEAM_ADM) return response(null, true, `Você não tem permissão para editar essa equipe`);

    let edit = await updateEquipe({ nome: name }, teamId);
    if (!edit) return response(null, true, `Erro ao editar equipe`);

    return response(true);
}

export const changeEquipeRole = async (params, body, user) => {
    const { equipe, membro, newRole } = params;

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    //logged role
    let equipeData = await getUserPrevilege(equipe, Colaborador.id);
    if (!equipeData || equipeData?.privilegio < TEAM_ADM) return response(null, true, `Você não tem permissão para editar essa equipe`);

    let equipeMembroData = await getUserPrevilege(equipe, membro);
    if ((equipeMembroData?.privilegio >= equipeData?.privilegio) || (equipeData?.privilegio == TEAM_ADM && newRole == TEAM_OWNER)) return response(null, true, `Você não tem permissão suficiente para editar este membro`);

    let edit = await updateEquipeToColaborador(membro, equipe, newRole);
    if (!edit) return response(null, true, `Erro ao editar`);

    // demote current user
    if (equipeData?.privilegio == 3 && newRole == 3) {
        await updateEquipeToColaborador(Colaborador.id, equipe, TEAM_ADM);
        await updateEquipe({ criador_equipe: membro }, equipe);
    }

    return response(true);
}

export const delEquipe = async (params, body, user) => {
    const { teamId } = params;

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    let equipeData = await getUserPrevilege(teamId, Colaborador.id);
    if (equipeData?.privilegio != TEAM_OWNER) return response(null, true, `Você não tem permissão para excluir essa equipe`);

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

    let equipe = await getEquipesById(teamId);

    //Logged Role
    let equipeData = await getUserPrevilege(teamId, Colaborador.id);
    if (!equipeData || equipeData?.privilegio < TEAM_ADM) return response(null, true, `Você não tem permissão para remover esse membro`);

    //Member Role
    let equipeMembroData = await getUserPrevilege(teamId, colId);
    if (equipeMembroData?.privilegio == TEAM_OWNER) return response(null, true, `Não é permitido remover dono da equipe`);

    const newTeam = equipe[0].colaboradores.filter(item => item != colId);
    await removeColaboradorFromOneEquipe(colId, teamId);
    await updateEquipe({ colaboradores: newTeam }, teamId);

    return response(true);
}

export const inviteMember = async (params, body, user) => {
    const { email, equipeId } = body;

    const emailList = Array.isArray(email) ? email : JSON.parse(email);

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    //Logged Role
    let equipeData = await getUserPrevilege(equipeId, Colaborador.id);
    if (!equipeData || equipeData?.privilegio < TEAM_ADM) return response(null, true, `Você não tem permissão para adicionar membros`);

    const equipe = await getEquipesById(equipeId);
    if (!equipe) return response(null, true, `Equipe não existe`);

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
            const inviteAlreadyExist = await getConviteByEmailAndEquipe(member.email, equipeRealId);

            if (inviteAlreadyExist.data?.length == 0) {
                inviteAdd.push({ anfitriao: Colaborador.id, email: member.email, equipe: equipeRealId });
            }
        }
    }

    if (inviteAdd.length > 0) {
        let invite = await addConvite(inviteAdd);
        if (!invite) return response(null, true, `Erro ao adicionar equipe!`);
    }

    return response({});
}

export const inviteVerify = async (params, body, user) => {
    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    const convites = await getConviteByEmail(Colaborador.usuario.email);
    if (convites.error) return response(null, true, `Erro ao verificar convites!`);

    if (convites.data.length > 0) {
        await Promise.all(
            convites.data.map(async (convite) => {
                await associateEquipeToColaborador(Colaborador.id, convite.equipe);
                await updateEquipeMember(Colaborador.id, convite.equipe);
            })
        );

        const removeConvites = await removeByEmail(Colaborador.usuario.email);
        if (!removeConvites) return response(null, true, `Erro ao verificar convites!`);
    }

    return response({});
}

export const emailTest = async (params, body, user) => {
    const { to, subject, msg } = body;

    const resp = await Email.send(to, subject, msg);
    if (resp.error) return response(resp);

    return response({});
}

// export const solveInvite = async (params, body, user) => {
//     const allInvites = await getAll()

//     let isItIn:any = [];

//     await Promise.all(
//         allInvites.data.map(async (invite) => {
//             const col = await getColaboradorByEmail(invite.email);

//             if(col){
//                 const equipe = await getEquipesById(invite.equipe);

//                 if(!equipe[0].colaboradores.includes(col.id)){
//                     isItIn.push(invite.id)
//                 }
//             }
//         })
//     );

//     return response(isItIn);
// }