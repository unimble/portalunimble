import { response } from "./utils.ts";

class Email {
  private apiKey: string;
  private sender: string;

  constructor() {
    this.apiKey = "re_dr7z2U8A_HG2PeK7m4V97fiihYxPqn9YP";
    this.sender = "portal@unimble.com.br"; 
  }

  public async send(to: string, subject: string, html: string) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: this.sender,
          to,
          subject,
          html,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Erro ao enviar e-mail:", data);
        return response(null, true, data);
      }

      return response(true);
    } catch (e) {
      console.error("Erro inesperado:", e);
      return response(null, true, "Erro inesperado ao enviar e-mail");
    }
  }
}

export default new Email();
