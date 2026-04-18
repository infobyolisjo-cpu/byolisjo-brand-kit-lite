// app/api/contact/route.ts
import { Resend } from "resend";

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { name, email, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return Response.json({ error: "Todos los campos son obligatorios." }, { status: 400 });
    }

    await resend.emails.send({
      from: "Brand Kit ByOlisJo <onboarding@resend.dev>",
      to: [process.env.CONTACT_EMAIL ?? "infobyolisjo@gmail.com"],
      subject: `Ayuda personalizada — ${name}`,
      text: `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;color:#1A1715">
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#9B6E2F;margin-bottom:16px">
            Brand Kit ByOlisJo — Solicitud de ayuda personalizada
          </p>
          <h2 style="font-size:20px;font-weight:700;margin-bottom:20px">${name}</h2>
          <p style="margin-bottom:4px;font-size:13px;color:#5C4A2E"><strong>Email:</strong> ${email}</p>
          <hr style="border:none;border-top:1px solid #E9E1D6;margin:20px 0"/>
          <p style="font-size:15px;line-height:1.75;white-space:pre-wrap">${message}</p>
        </div>
      `,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[contact]", err);
    return Response.json({ error: "No se pudo enviar. Intenta de nuevo." }, { status: 500 });
  }
}
