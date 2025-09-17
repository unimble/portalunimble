import { supaCli } from "../../utils/supaClient.ts";
import { response } from "../../utils/utils.ts";

export const generateTempLink = async (fileName = "", file) => {
    const { error: uploadError } = await supaCli?.storage
        .from("pdfs")
        .upload(fileName, file, { contentType: "application/pdf" });

    if (uploadError) {
        return response(null, true, 'Não foi possivel criar um link!');
    }

    // Gera Signed URL (5 minutos)
    const { data: signedUrlData } = await supaCli?.storage
        .from("pdfs")
        .createSignedUrl(fileName, 60 * 5);

    return response(signedUrlData?.signedUrl);
}