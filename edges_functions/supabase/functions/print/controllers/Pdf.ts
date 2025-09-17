import { response, generatePDF } from "../../utils/utils.ts";

import * as MetaDadosService from "../../retaguarda/service/MetaDados.ts";
import * as service from "../services/pdf.ts";
import { getColaboradorByUserIdExpand } from "../../cliente/service/Colaborador.ts";

export const printProccessById = async (params, body, user, headers, query) => {
    const { item } = params;

    const Colaborador = await getColaboradorByUserIdExpand(user.id);
    if (!Colaborador) return response(null, true, `Colaborador não existe`);

    const proccessItem = await MetaDadosService.getMetaDadosSingleTemp("Processos", Colaborador.id, '', item);
    if(!proccessItem?.[0]) return response(null, true, `Não foi possivel gerar o link do pdf`);
    
    const pdfContent = proccessItem[0].data["Conteúdo do Processo"];

    const pdfBytes = await generatePDF(pdfContent);

    const file = new Blob([pdfBytes], { type: "application/pdf" });
    const fileName = `processos/${item}-${Date.now()}.pdf`;

    const pdfLink = await service.generateTempLink(fileName, file);
    if(pdfLink.error) return response(null, true, `Não foi possivel gerar o link do pdf`);

    return response({link: pdfLink.data});
};