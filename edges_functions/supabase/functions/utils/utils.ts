import { nanoid } from "https://deno.land/x/nanoid/mod.ts";

import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";

import { supaCli, supa } from "./supaClient.ts";
import routes from "./routes.ts";

export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, Content-Type, apikey, X-Client-Info, X-Context',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

export const TEAM_WORKER = 1;
export const TEAM_ADM = 2;
export const TEAM_OWNER = 3;

export function createResponse(body: any, status = 200, headers = {}) {
    return new Response(JSON.stringify(body), {
        headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            ...headers,
        },
        status: status,
    });
}

export function createPDFResponse(content, fileName, headers = {}) {
    return new Response(content, {
        headers: {
            ...corsHeaders,
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=' + fileName + '.pdf',
            ...headers,
        }
    });
}
//Auth
export const verifyUserIntegrity = async (headers) => {
    const token = getAuth(headers);
    supa(token);

    if (!token) return false;

    const { data, error } = await supaCli.auth.getUser(token);

    if (error != null) return false;

    return { user: data.user, token };
}

export const getNanoId = () => {
    return nanoid();
}

export const isNanoid = (id: string) => {
  return /^[A-Za-z0-9_-]{21}$/.test(id);
}

export const generatePDF = async (pdfContent) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    page.drawText("Unimble", {
        x: 50, y: 750, size: 20, font: fontBold, color: rgb(0, 0.53, 0.71),
    });

    page.drawText("Processo #123", {
        x: 400, y: 750, size: 16, font: fontBold,
    });

    page.drawText("Equipe: Equipe Alfa", { x: 50, y: 700, size: 12, font });
    page.drawText("Responsável: João Silva", { x: 50, y: 680, size: 12, font });
    page.drawText("Data: 12/09/2025", { x: 50, y: 660, size: 12, font });

    page.drawRectangle({ x: 50, y: 640, width: 500, height: 1, color: rgb(0.8, 0.8, 0.8) });

    const conteudo = stripHtml(pdfContent).split("\n");
    let y = 600;
    conteudo.forEach((linha) => {
        page.drawText(sanitizeText(linha), { x: 50, y, size: 12, font });
        y -= 20;
    });

    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
}

export const stripHtml = (richText: string) => {
    return richText.replace(/<[^>]+>/g, "");
}

export const sanitizeText = (richText: string) => {
  return richText.replace(/[^\x20-\xFF]/g, "");
}

export const getAuth = (headers) => {
    let jwt = Object.fromEntries(headers).authorization;
    jwt = jwt.split(" ");

    if (jwt[0] != "Bearer") return false;
    jwt = jwt[1];

    return jwt;
}
//Router
export const router = (method, url) => {
    const cleanedUrl = getCleanUrl(url);
    const methodInvoked = routes[method.toLowerCase()];

    if (!(Array.isArray(methodInvoked) && methodInvoked.length > 0)) return false;

    for (const item of methodInvoked) {
        // Cria um padrão para a URL usando expressões regulares
        const pattern = item.route
            .replace(/:[a-z0-9]+/gi, '([^/]+)')  // Substitui parâmetros da URL por expressões regulares
            .replace(/\//g, '\\/');  // Escapa as barras na URL

        const regex = new RegExp(`^${pattern}$`, 'i');  // Cria uma expressão regular para a URL

        const match = cleanedUrl.match(regex);  // Testa a URL contra o padrão

        if (match) {
            // Extrai os parâmetros da URL se existirem
            const params = {};
            const keys = (item.route.match(/:[a-z0-9]+/gi) || []).map(param => param.substring(1));  // Extrai os nomes dos parâmetros
            keys.forEach((key, index) => {
                params[key] = match[index + 1];
            });

            // Retorna a função associada à rota e os parâmetros
            return {
                function: item.function,
                params
            };
        }
    }

    return false;
}
//Helpers
export const getCleanUrl = (url) => {
    const cleanUrl = url.split('/').slice(4);

    return "/" + cleanUrl.join('/');
}
export const isNumber = (target) => {
    const expression = /^\d+$/;

    return expression.test(target);
}

export const response = (data: any = null, error = false, msg = "Ops ocorreu um erro inesperado!", code = "") => {
    return { error, msg, code, data };
}

export const responsePdf = (content = null, fileName = "", error = false, msg: any = "Ops ocorreu um erro inesperado!") => {
    return { content, fileName, error, msg };
}

export const parseBase64 = (base64String) => {
    const matches = base64String.match(/^data:(.*);base64,(.*)$/);
    if (!matches || matches.length !== 3) {
        throw new Error('Formato base64 inválido');
    }

    const contentType = matches[1];  // Ex: "image/png"
    const base64Data = matches[2];  // Os dados da imagem
    const byteCharacters = atob(base64Data);
    const byteArrays = new Uint8Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays[i] = byteCharacters.charCodeAt(i);
    }

    return {
        blob: new Blob([byteArrays], { type: contentType }),
        contentType
    };
}

export const arraysAreEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;

    // Ordenar os arrays
    let sortedArr1 = arr1.slice().sort((a, b) => a - b);
    let sortedArr2 = arr2.slice().sort((a, b) => a - b);

    // Comparar os arrays ordenados
    for (let i = 0; i < sortedArr1.length; i++) {
        if (sortedArr1[i] !== sortedArr2[i]) return false;
    }

    return true;
}