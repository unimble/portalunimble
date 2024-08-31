import { response, isNumber, arraysAreEqual } from "../../utils/utils.ts";
import * as dadoService from "../service/Dado.ts";
import * as TipoItemService from "../service/TipoDeItem.ts";
import * as metaInstanciaService from "../service/MetaInstancia.ts";
import * as metaEstruturaService from "../service/MetaEstrutura.ts";
import * as ItemService from "../service/Item.ts";
import * as MetaDadosService from "../service/MetaDados.ts";

//cliente
import { getColaboradorByUserId, getColaboradorByUserIdExpand } from "../../cliente/service/Colaborador.ts";
import { getEmpresaByColaboradorId } from "../../cliente/service/Empresa.ts";


export const addComentario = async (params, body, user) => {
    const { conteudo } = body;

    const Colaborador = await getColaboradorByUserId(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    if (!conteudo) return response(null, true, "Informe o conteudo do comentario");

    const { id, text } = JSON.parse(conteudo);

    if (!id || !text) return response(null, true, "Informe o conteudo do comentario");

    const itemExist = await TipoItemService.getItemFullStructureByName("Comentários");
    if (!itemExist) return response(null, true, `Tipo de item Comentários não existe`);

    const registerDado = await dadoService.addDado([{ TipoDeDado: id, Conteudo: text }]);
    if (registerDado.error) return response(null, true, msg, code);

    const instanciaBody = itemExist.estrutura.filter(item => item.dadoDependente == id)[0];

    const registerMetaInstancia = await metaInstanciaService.addMetaInstancia([{ dado: registerDado.data.id, metaEstrutura: instanciaBody.id }]);
    if (registerMetaInstancia.error) return response(null, true, msg, code);

    const registerItem = await ItemService.addItem(Colaborador.id, [registerMetaInstancia[0].id]);
    if (registerItem.error) return response(null, true, msg, code);

    return response({ registerItem });
}

export const addCiclo = async (params, body, user) => {
    const { conteudo } = body;

    const registerMetadado = await MetaDadosService.registerMetadado("Ciclo", conteudo, user.id);
    if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);

    return response(registerMetadado.data);
}

export const addForça = async (params, body, user) => {
    const { conteudo } = body;

    const registerMetadado = await MetaDadosService.registerMetadado("Forças", conteudo, user.id);
    if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);

    return response(registerMetadado.data);
}

export const addOportunidades = async (params, body, user) => {
    const { conteudo } = body;

    const registerMetadado = await MetaDadosService.registerMetadado("Oportunidades", conteudo, user.id);
    if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);

    return response(registerMetadado.data);
}

export const addConquistas = async (params, body, user) => {
    const { conteudo } = body;

    const registerMetadado = await MetaDadosService.registerMetadado("Conquistas", conteudo, user.id);
    if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);

    return response(registerMetadado.data);
}

export const addObjetivos = async (params, body, user) => {
    const { conteudo } = body;

    const registerMetadado = await MetaDadosService.registerMetadado("Objetivos", conteudo, user.id);
    if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);

    return response(registerMetadado.data);
}

export const addResultado = async (params, body, user) => {
    const { conteudo } = body;

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    const resultado = await TipoItemService.getItemFullStructureByName("Resultados");
    if (!resultado) return response(null, true, `Tipo de item ciclo não existe`);

    const resultadoExist = await ItemService.getItensByItemBaseByColaborador(resultado.tipoItem.id, Colaborador.id);
    if (resultadoExist.length > 0) {
        const bodyStruture = JSON.parse(conteudo);
        const bdStruture = String(resultadoExist[0].depende_de).split(',').map(Number);

        if (!arraysAreEqual(bodyStruture, bdStruture)) {
            const updateMetadado = await MetaDadosService.updateMetadadoItem("Resultados", bodyStruture, user.id, resultadoExist[0].id, true);
            if (updateMetadado.error) return response(null, true, updateMetadado.msg, updateMetadado.code);
            return response(updateMetadado.data);
        }

        return response(true);
    } else {
        const registerMetadado = await MetaDadosService.registerMetadadoItem("Resultados", conteudo, user.id);
        if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);

        return response(registerMetadado.data);
    }
}

export const addMeta = async (params, body, user) => {
    const { conteudo, objetivoId } = body;

    const registerMetadado = await MetaDadosService.registerMetadado("Meta", conteudo, user.id);
    if (registerMetadado.error) return response(null, true, registerMetadado.msg, registerMetadado.code);

    const updateObjetivo = await MetaDadosService.updateMetadadoItem("Objetivos", [registerMetadado.data.id], user.id, objetivoId);
    if (updateObjetivo.error) return response(null, true, updateObjetivo.msg, updateObjetivo.code);

    return response(updateObjetivo.data);
}

export const editItem = async (params, body, user) => {
    const { item } = params;
    const { conteudo } = body;

    const edited = await MetaDadosService.editMetaDado(item, conteudo);

    return response(edited);
}

export const delItem = async (params, body, user) => {
    const { id } = params;

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    const deleteResult = await MetaDadosService.deleteMetadado(id, Colaborador.id);
    if (deleteResult.error) return response(null, true, deleteResult.msg, deleteResult.code);

    return response(deleteResult);
}

export const getCiclo = async (params, body, user) => {
    let ciclo = await MetaDadosService.getMetaDados("Ciclo");
    return response(ciclo);
}

export const getPlanejamento = async (params, body, user) => {
    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    const Empresa = await getEmpresaByColaboradorId(Colaborador.id);
    if (!Empresa) return response(null, true, `Empresa não existe`);

    let forcas = await MetaDadosService.getMetaDados("Forças", Colaborador.id);
    let oportunidades = await MetaDadosService.getMetaDados("Oportunidades", Colaborador.id);
    let conquistas = await MetaDadosService.getMetaDados("Conquistas", Colaborador.id);
    let objetivos = await MetaDadosService.getMetaDados("Objetivos", Colaborador.id);
    let resultados = await MetaDadosService.getMetaDados("Resultados", Colaborador.id);
    let cicloId = 0;

    if (resultados.components) {
        cicloId = resultados.components.dados.filter(c => c.nome == "Ciclo")[0].id;
    }

    return response({
        fullName: Colaborador.usuario.nome,
        companyName: Empresa[0].nome,
        urgency: Empresa[0].urgencia,
        forcas,
        cicloId: cicloId,
        oportunidades,
        conquistas,
        objetivos,
        resultados
    });
}

export const getForm = async (params, body, user) => {
    const { kind } = params;
    const item = await TipoItemService.getItemFullStructureByName(decodeURIComponent(kind));
    if (!item) return response(null, true, `Tipo de item inexistente`);

    const estrutura = await metaEstruturaService.getByItemIdExpand(item.tipoItem.id);
    if (!estrutura) return response(null, true, `Tipo de item inexistente`);

    estrutura.sort((a, b) => a.ordem - b.ordem);

    return response(estrutura);
}