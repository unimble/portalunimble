import { response } from "./utils.ts";

class Email {
  private apiKey: string = "re_dr7z2U8A_HG2PeK7m4V97fiihYxPqn9YP";
  private sender: string = "portal@unimble.com.br";

  public async send(to: string, subject: string, html: string) {
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

    if (!res.ok) {
      const err = await res.text();
      return response(err, true, "Não foi possivel enviar email");
    }

    return response({});
  }
}

export default new Email();
