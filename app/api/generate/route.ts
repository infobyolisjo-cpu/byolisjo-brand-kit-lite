// app/api/generate/route.ts
import { NextResponse } from "next/server";

type Input = { prompt?: string };

const palettes = [
  { name: "Beige & Gold Premium", colors: ["#F5EFE6", "#E8D9C5", "#C3A572", "#8C6B3E", "#27231F"] },
  { name: "Lila & Nude Soft",     colors: ["#F3ECF7", "#E6D9EE", "#C9B7D6", "#9C84AE", "#2C2730"] },
  { name: "Terracota & Rosa",     colors: ["#F9EDEA", "#F3C7BE", "#E39F8C", "#B56A55", "#2B1F1D"] },
];

const fonts = {
  elegante: { heading: "Cormorant Garamond", body: "Inter" },
  moderna:  { heading: "DM Serif Display",  body: "Sora"  },
  minimal:  { heading: "Playfair Display",  body: "Manrope"},
};

const voices = {
  premium:  "Elegante, clara, orientada a valor percibido y resultados.",
  cercana:  "Humana, empática, explica con ejemplos simples.",
  directa:  "Breve, útil y accionable; evita adornos.",
};

function pick<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)]; }

export async function POST(req: Request) {
  try {
    const { prompt } = (await req.json()) as Input;
    const txt = (prompt || "").toLowerCase();

    const isElegante = /elegant|elegante|premium|lujo/.test(txt);
    const isModerna  = /moderna|tech|tecnolog|digital|ai|ia/.test(txt);
    const isSuave    = /femenina|suave|nude|pastel|calma/.test(txt);
    const isTerracota= /tierra|artesanal|cálid|calide|terracota/.test(txt);

    const palette =
      (isElegante && palettes[0]) ||
      (isSuave && palettes[1])    ||
      (isTerracota && palettes[2])||
      pick(palettes);

    const font =
      (isElegante && fonts.elegante) ||
      (isModerna  && fonts.moderna)  ||
      fonts.minimal;

    const voice =
      (isElegante && voices.premium) ||
      (isSuave    && voices.cercana) ||
      voices.directa;

    const slogan = isElegante
      ? "Elegancia que comunica valor."
      : isTerracota
        ? "Calidez artesanal que conecta."
        : isModerna
          ? "Innovación con identidad."
          : "Tu esencia, con claridad.";

    const posts = [
      { title: "Presenta tu promesa",  copy: "En una frase: ¿qué cambias en la vida de tu cliente? #brandingconpropósito" },
      { title: "Color en contexto",    copy: `Usa ${palette.colors[2]} para CTA y ${palette.colors[4]} para texto principal.` },
      { title: "CTA que convierte",    copy: "Pide una acción única y medible. Ej.: “Descarga tu guía visual”." },
    ];

    const canvaQuery = encodeURIComponent(`${palette.name} ${font.heading} ${font.body} mockup brand kit`);
    const canvaSearch = `https://www.canva.com/templates/?query=${canvaQuery}`;

    return NextResponse.json({
      palette, font, voice, slogan, posts, canvaSearch,
      tip: "Exporta esta guía a Canva y ajusta contrastes (ideal AA)."
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
}
