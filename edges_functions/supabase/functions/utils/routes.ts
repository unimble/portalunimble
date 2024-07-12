import * as TipoDeDado from "../retaguarda/controllers/TipoDeDado.ts";
import * as User from "../cliente/controllers/User.ts";

export default {
    get: [],
    post: [
        { route: "/addTipoItem", function: "addTipoItem" },
        { route: "/add-tipodedado", function: TipoDeDado.addTipoDado },
        { route: "/add-user", function: User.addUser }
    ],
    delete: [
        { route: "/delTipoDado/:id", function: TipoDeDado.delTipoDado },
    ],
    put: []
}