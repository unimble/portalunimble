import * as TipoDeDado from "../retaguarda/controllers/TipoDeDado.ts";
import * as TipoDeItem from "../retaguarda/controllers/TipoDeItem.ts";
import * as Planejamento from "../retaguarda/controllers/Planejamento.ts";
import * as Perfil from "../cliente/controllers/Perfil.ts";
import * as User from "../cliente/controllers/User.ts";
import * as Permissao from "../cliente/controllers/Permissao.ts";

export default {
    get: [
        { route: "/get-perfil", function: Perfil.getAllPerfil },
        //planejamento
        { route: "/planejamento", function: Planejamento.getPlanejamento },
        { route: "/planejamento/form/:kind", function: Planejamento.getForm },
        { route: "/planejamento/ciclo", function: Planejamento.getCiclo },
        { route: "/planejamento/ciclo/:select", function: Planejamento.getCiclo },
    ],
    post: [
        { route: "/add-tipoitem", function: TipoDeItem.addTipoItem },
        { route: "/add-tipodedado", function: TipoDeDado.addTipoDado },
        { route: "/add-user", function: User.addUser },
        { route: "/add-permission", function: Permissao.addPermissao },
        { route: "/add-perfil", function: Perfil.addPerfil },
        //Planejamento
        { route: "/planejamento/comentario", function: Planejamento.addComentario },
        { route: "/planejamento/ciclo", function: Planejamento.addCiclo },
        { route: "/planejamento/força", function: Planejamento.addForça },
        { route: "/planejamento/oportunidades", function: Planejamento.addOportunidades },
        { route: "/planejamento/conquistas", function: Planejamento.addConquistas },
        { route: "/planejamento/objetivos", function: Planejamento.addObjetivos },
        { route: "/planejamento/resultado", function: Planejamento.addResultado },
        { route: "/planejamento/meta", function: Planejamento.addMeta },
        { route: "/planejamento/complementar", function: User.complementar },
    ],
    delete: [
        { route: "/del-tipodedado/:id", function: TipoDeDado.delTipoDado },
        { route: "/del-tipoitem/:id", function: TipoDeItem.delTipoItem },
        { route: "/del-permissao/:id", function: Permissao.delPermissao },
        { route: "/del-perfil/:id", function: Perfil.delPerfil },
        { route: "/del-item/:id", function: Planejamento.delItem },
    ],
    put: [
        { route: "/edit-tipoitem/:id", function: TipoDeItem.editTipoItem },
        { route: "/edit-permission/:id", function: Perfil.editPerfil },
        { route: "/edit-perfil/:id/:userId", function: Perfil.editUserPerfil },
        { route: "/planejamento/força/:item", function: Planejamento.editForça },
        { route: "/planejamento/oportunidades/:item", function: Planejamento.editItem },
        { route: "/planejamento/conquistas/:item", function: Planejamento.editItem },
        { route: "/planejamento/objetivos/:item", function: Planejamento.editItem },
    ]
}