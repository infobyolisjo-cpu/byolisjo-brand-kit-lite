// app/api/generate/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Hash simple y determinístico según el texto */
function hash(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Paletas agrupadas por estilo */
const PALETTES = {
  elegante: [
    { name: "Beige & Gold Premium", colors: ["#F5EFE6","#E8D9C5","#C3A572","#8C6B3E","#27231F"] },
    { name: "Marfil & Caramelo",    colors: ["#FBF7F1","#E7D9C8","#BDA07B","#8B6A46","#2A2420"] },
  ],
  moderna: [
    { name: "Azules Tech",          colors: ["#E7F1FF","#CFE2FF","#7EB3FF","#2B6CB0","#101622"] },
    { name: "Neón sutil",           colors: ["#F3FFF7","#D6FFE7","#59E3A7","#1E7F5C","#101A16"] },
  ],
  suave: [
    { name: "Lila & Nude Soft",     colors: ["#F3ECF7","#E6D9EE","#C9B7D6","#9C84AE","#2C2730"] },
    { name: "Rosa & Arena",         colors: ["#FFF1F3","#FADDE1","#F3B6C1","#C87993","#2C2224"] },
  ],
  terracota: [
    { name: "Terracota & Rosa",     colors: ["#F9EDEA","#F3C7BE","#E39F8C","#B56A55","#2B1F1D"] },
    { name: "Arcilla & Oliva",      colors: ["#FAF3E7","#EBD8BF","#C88C5A","#6E7F58","#2A271F"] },
  ],
} as const;

/** Fuentes por estilo */
const FONTS = {
  elegante: { heading: "Cormorant Garamond", body: "Inter" },
  moderna:  { heading: "DM Serif Display",    body: "Sora"  },
  suave:    { heading: "Playfair Display",    body: "Manrope"},
  terracota:{ heading: "Libre Baskerville",   body: "Nunito"},
} as const;

/** Voz por estilo */
const VOICES = {
  elegante: "Elegante, clara, orientada a valor percibido y resultados.",
  moderna:  "Directa, útil y accionable; evita adornos.",
  suave:    "Humana, empática, explica con ejemplos simples.",
  terracota:"Cálida y cercana; destaca lo artesanal y honesto.",
} as const;

type Body = { prompt?: string; count?: number; startSeed?: number };

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Admite query (?n=) o body (count/startSeed)
    const qN = Number(searchParams.get("n"));
    const bodyJson = (await req.json().catch(() => ({}))) as Body;

    const txt = (bodyJson.prompt || "brand").toLowerCase().trim();
    const count = Math.max(
      1,
      Math.min(50, Number.isFinite(qN) && qN! > 0 ? (qN as number) : (bodyJson.count ?? 1))
    );
    const startSeed = Math.max(0, Math.floor(bodyJson.startSeed ?? 0));

    // Estilos disponibles
    const styles = ["elegante", "moderna", "suave", "terracota"] as const;

    // ⚠️ IMPORTANTE: el índice base del estilo incluye startSeed para que cada lote empiece distinto
    const styleBaseIdx = (hash(txt) + startSeed) % styles.length;

    // Helpers para variar determinísticamente por seed
    const pickPalette = (style: (typeof styles)[number], seed: number) => {
      const group = PALETTES[style];
      const idx = hash(`${txt}|pal|${seed}`) % group.length;
      return group[idx];
    };
    const pickSlogan = (style: (typeof styles)[number], seed: number) => {
      const sets: Record<(typeof styles)[number], string[]> = {
        elegante: [
          "Elegancia que comunica valor.",
          "Belleza sobria, impacto real.",
          "Prestigio que se nota.",
        ],
        moderna: [
          "Innovación con identidad.",
          "Claro. Útil. Memorables.",
          "Diseño que acelera decisiones.",
        ],
        suave: [
          "Sutileza que enamora.",
          "Delicadeza con intención.",
          "Tu historia, en tonos suaves.",
        ],
        terracota: [
          "Calidez artesanal que conecta.",
          "Texturas que cuentan historias.",
          "Raíz y carácter en cada detalle.",
        ],
      };
      const arr = sets[style];
      return arr[hash(`${txt}|slog|${seed}`) % arr.length];
    };

    // Construye "count" propuestas usando seeds consecutivos (startSeed..)
    const options = Array.from({ length: count }, (_, i) => {
      const seed = startSeed + i;
      // Rota estilo combinando base e incremento por seed
      const style = styles[(styleBaseIdx + i) % styles.length];

      const palette = pickPalette(style, seed);
      const font = FONTS[style];
      const voice = VOICES[style];
      const slogan = pickSlogan(style, seed);

      const posts = [
        { title: "Presenta tu promesa",  copy: "En una frase: ¿qué cambias en la vida de tu cliente? #brandingconpropósito" },
        { title: "Color en contexto",    copy: `Usa ${palette.colors[2]} para CTA y ${palette.colors[4]} para texto principal.` },
        { title: "CTA que convierte",    copy: "Pide una acción única y medible. Ej.: “Descarga tu guía visual”." },
      ];

      const canvaQuery  = encodeURIComponent(`${palette.name} ${font.heading} ${font.body} mockup brand kit`);
      const canvaSearch = `https://www.canva.com/templates/?query=${canvaQuery}`;

      return {
        seed, style, palette, font, voice, slogan, posts, canvaSearch,
        tip: "Exporta esta guía a Canva y ajusta contraste (ideal AA).",
      };
    });

    return NextResponse.json(
      { options, nextStartSeed: startSeed + count },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
}
