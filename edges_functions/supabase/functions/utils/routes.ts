import * as TipoDeDado from "../retaguarda/controllers/TipoDeDado.ts";
import * as TipoDeItem from "../retaguarda/controllers/TipoDeItem.ts";
import * as Planejamento from "../retaguarda/controllers/Planejamento.ts";
import * as Principal from "../retaguarda/controllers/Principal.ts";
import * as Perfil from "../cliente/controllers/Perfil.ts";
import * as Colaborador from "../cliente/controllers/Colaborador.ts";
import * as User from "../cliente/controllers/User.ts";
import * as Equipe from "../cliente/controllers/Equipe.ts";
import * as Empresa from "../cliente/controllers/Empresa.ts";
import * as Permissao from "../cliente/controllers/Permissao.ts";
import * as PDF from "../print/controllers/Pdf.ts";

export default {
    get: [
        { route: "/get-perfil", function: Perfil.getAllPerfil },
        //planejamento
        { route: "/planejamento", function: Planejamento.getPlanejamento },
        { route: "/planejamento/metadado/:item/:kind", function: Planejamento.getMetaDadoAll },
        { route: "/planejamento/metadado/:item", function: Planejamento.getMetaDadoAll },
        { route: "/planejamento/metadado/:item/:kind/:id", function: Planejamento.getMetaDadoSingle },
        { route: "/planejamento/metadado/:item/:id", function: Planejamento.getMetaDadoSingle },
        { route: "/planejamento/all/metadado/:item/:field", function: Planejamento.getMetaDadoIncludingAllTeams },
        { route: "/planejamento/me/:item", function: Planejamento.getPlanejamentoByItem },
        { route: "/planejamento/team/:item", function: Planejamento.getPlanejamentoItemByTeam },
        { route: "/planejamento/company/:item", function: Planejamento.getPlanejamentoByItemCompany },
        { route: "/planejamento/me/:item/:id", function: Planejamento.getPlanejamentoByItemId },
        { route: "/planejamento/allforms", function: Planejamento.getAllForm },
        { route: "/planejamento/form/:kind", function: Planejamento.getForm },
        { route: "/planejamento/formEdit/:id", function: Planejamento.getFormEdit },
        { route: "/planejamento/new/formEdit/:id", function: Planejamento.getFormEditNew },
        { route: "/planejamento/ciclo", function: Planejamento.getCiclo },
        { route: "/planejamento/ciclo/:select", function: Planejamento.getCiclo },
        { route: "/planejamento/tarefas/projeto/:id", function: Planejamento.getProjectTasks },
        { route: "/planejamento/projeto/conclusao/:id", function: Planejamento.getProjectconclusion  },
        { route: "/planejamento/projeto/usuario/:id", function: Planejamento.getProjectLider  },
        { route: "/planejamento/kanban/padrao", function: Planejamento.getKanbanPadrao  },
        //Pagina principal
        { route: "/teste", function: Principal.testeEnv },
        { route: "/unimble/me", function: Principal.getHomeData },
        { route: "/unimble/loader/:type/:page", function: Principal.getPageInfo },
        { route: "/unimble/equipe", function: Principal.getEquipe },
        { route: "/unimble/print/processos/:item", function: PDF.printProccessById },
        // { route: "/unimble/equipe/:item", function: Principal.getEquipeTemp },
        { route: "/unimble/equipe/membros/:id", function: Principal.getEquipeMembros },
        { route: "/unimble/equipe/pendente/:id", function: Principal.getEquipePendente },
    ],
    post: [
        // { route: "/setNanoId", function: Equipe.setNano },
        { route: "/recuperar", function: User.recuperar },
        { route: "/add-tipoitem", function: TipoDeItem.addTipoItem },
        { route: "/add-tipodedado", function: TipoDeDado.addTipoDado },
        { route: "/add-user", function: User.addUser },
        { route: "/add-permission", function: Permissao.addPermissao },
        { route: "/add-perfil", function: Perfil.addPerfil },
        { route: "/add-team", function: Principal.addTeam },
        { route: "/invite-member", function: Principal.inviteMember },
        { route: "/invite-verify", function: Principal.inviteVerify },
        //Planejamento
        { route: "/planejamento/okr", function: Planejamento.getOkr },
        { route: "/planejamento/comentario", function: Planejamento.addComentario },
        { route: "/planejamento/kanban", function: Planejamento.addKanban },
        { route: "/planejamento/ciclo", function: Planejamento.addCiclo },
        { route: "/planejamento/força", function: Planejamento.addForça },
        { route: "/planejamento/oportunidades", function: Planejamento.addOportunidades },
        { route: "/planejamento/conquistas", function: Planejamento.addConquistas },
        { route: "/planejamento/objetivos", function: Planejamento.addObjetivos },
        /*-------------------*/
        { route: "/planejamento/resultado", function: Planejamento.addResultado },
        { route: "/planejamento/resultadoFromScratch", function: Planejamento.addResultadoFromScratch },
        { route: "/planejamento/resultado/duplicar/:cycleBase/:cycleId/:keepValue", function: Planejamento.addResultadoDuplicar },
        { route: "/planejamento/meta", function: Planejamento.addMeta },
        { route: "/planejamento/metaAtual", function: Planejamento.addMetaAtual },
        /*-------------------*/
        { route: "/planejamento/complementar", function: User.complementar },
        { route: "/planejamento/tarefa", function: Planejamento.addTarefa },
        { route: "/planejamento/blank/:item", function: Planejamento.addBlank },
        { route: "/planejamento/processo", function: Planejamento.addProcesso },
        { route: "/planejamento/projeto", function: Planejamento.addProjeto },
    ],
    delete: [
        { route: "/del-tipodedado/:id", function: TipoDeDado.delTipoDado },
        { route: "/del-tipoitem/:id", function: TipoDeItem.delTipoItem },
        { route: "/del-permissao/:id", function: Permissao.delPermissao },
        { route: "/del-perfil/:id", function: Perfil.delPerfil },
        { route: "/del-colaborador/:id", function: Colaborador.delColaborador },
        { route: "/del-item/:id", function: Planejamento.delItem },
        { route: "/del-team/:teamId", function: Principal.delEquipe },
        { route: "/del-teamate/:teamId/:colId", function: Principal.removeUserFromTeam },
    ],
    put: [
        { route: "/edit-user-company", function: Empresa.editEmpresa },
        { route: "/edit-user-profile", function: User.addUserProfile },
        { route: "/edit-user-name", function: User.editUserName },
        { route: "/edit-tipoitem-structure/:id", function: TipoDeItem.editTipoItemStructure },
        { route: "/edit-tipoitem/:id", function: TipoDeItem.editTipoItem },
        { route: "/edit-tipoitem/associate/:parentId/:childId", function: TipoDeItem.associateTipoItemInstance },
        { route: "/edit-permission/:id", function: Perfil.editPerfil },
        { route: "/edit-photo", function: Perfil.editPhoto },
        { route: "/edit-perfil/:id/:userId", function: Perfil.editUserPerfil },
        { route: "/planejamento/okr/:item", function: Planejamento.editOkr },
        { route: "/planejamento/força/:item", function: Planejamento.editItem },
        { route: "/planejamento/oportunidades/:item", function: Planejamento.editItem },
        { route: "/planejamento/conquistas/:item", function: Planejamento.editItem },
        { route: "/planejamento/objetivos/:item", function: Planejamento.editItem },
        { route: "/planejamento/metas/:item", function: Planejamento.editItem },
        { route: "/planejamento/generic/:item", function: Planejamento.editItem },
        { route: "/planejamento/ciclos/:item", function: Planejamento.editCycle },
        { route: "/planejamento/metasedit/:item", function: Planejamento.editTarefaConcluido },
        { route: "/planejamento/tarefa/:item", function: Planejamento.editItem },
        { route: "/planejamento/processos/:item", function: Planejamento.editItem },
        { route: "/planejamento/projeto/:projId/tarefa/:taskId", function: Planejamento.editProjectIncludeTask },
        { route: "/planejamento/projeto/:item", function: Planejamento.editItem },
        { route: "/planejamento/kanban/:item", function: Planejamento.editItem },
        { route: "/planejamento/atas/:item", function: Planejamento.editItem },
        { route: "/planejamento/guia/:item", function: Planejamento.editItem },
        { route: "/planejamento/done", function: Planejamento.finish },
        { route: "/unimble/equipe/:teamId", function: Principal.editEquipe },
    ]
}