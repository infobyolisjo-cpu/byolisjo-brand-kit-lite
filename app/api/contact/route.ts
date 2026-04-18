// app/api/contact/route.ts
import { Resend } from "resend";

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(req: Request) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return Response.json({ success: false, error: "Cuerpo de solicitud inválido." }, { status: 400 });
    }

    const { name, email, message } = body as Record<string, string>;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return Response.json({ success: false, error: "Todos los campos son obligatorios." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[contact] RESEND_API_KEY no configurada");
      return Response.json({ success: false, error: "Servicio de correo no configurado." }, { status: 503 });
    }

    const resend = new Resend(apiKey);
    const to = process.env.CONTACT_EMAIL ?? "infobyolisjo@gmail.com";

    const { error: sendError } = await resend.emails.send({
      from: "Brand Kit ByOlisJo <onboarding@resend.dev>",
      to: [to],
      subject: `Ayuda personalizada — ${name}`,
      text: `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;color:#1A1715">
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#9B6E2F;margin-bottom:16px">
            Brand Kit ByOlisJo — Solicitud de ayuda personalizada
          </p>
          <h2 style="font-size:20px;font-weight:700;margin-bottom:20px">${esc(name)}</h2>
          <p style="margin-bottom:4px;font-size:13px;color:#5C4A2E"><strong>Email:</strong> ${esc(email)}</p>
          <hr style="border:none;border-top:1px solid #E9E1D6;margin:20px 0"/>
          <p style="font-size:15px;line-height:1.75;white-space:pre-wrap">${esc(message)}</p>
        </div>
      `,
    });

    if (sendError) {
      console.error("[contact] Resend error:", sendError);
      return Response.json({ success: false, error: "No se pudo enviar el mensaje. Intenta de nuevo." }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("[contact] unexpected error:", err);
    return Response.json({ success: false, error: "Error inesperado. Intenta de nuevo." }, { status: 500 });
  }
}
