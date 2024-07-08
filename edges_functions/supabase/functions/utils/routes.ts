import * as retaguarda from "../retaguarda/controllers/TipoDeDado.ts";

export default {
    get: [],
    post: [
        { route: "/addTipoItem", function: "addTipoItem" },
        { route: "/addTipoDado", function: retaguarda.addTipoDado }
    ],
    delete: [
        { route: "/delTipoDado/:id", function: retaguarda.delTipoDado },
    ],
    put: []
}