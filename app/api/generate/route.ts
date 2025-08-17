// app/api/generate/route.ts
import { NextResponse } from "next/server";

/** Hash sencillo para hacer la selección determinística por prompt */
function hash(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Paletas agrupadas por “estilo” */
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
};

/** Fuentes recomendadas por estilo */
const FONTS = {
  elegante: { heading: "Cormorant Garamond", body: "Inter" },
  moderna:  { heading: "DM Serif Display",    body: "Sora"  },
  suave:    { heading: "Playfair Display",    body: "Manrope"},
  terracota:{ heading: "Libre Baskerville",   body: "Nunito"},
};

/** Voz por estilo */
const VOICES = {
  elegante: "Elegante, clara, orientada a valor percibido y resultados.",
  moderna:  "Directa, útil y accionable; evita adornos.",
  suave:    "Humana, empática, explica con ejemplos simples.",
  terracota:"Cálida y cercana; destaca lo artesanal y honesto.",
};

type Input = { prompt: string };

export async function POST(req: Request) {
  const { prompt } = (await req.json()) as Input;
  const txt = (prompt || "").toLowerCase().trim();

  // Heurísticas por palabras clave
  const isElegante  = /elegant|elegante|premium|lujo|clásic/.test(txt);
  const isModerna   = /moderna|modern|tech|tecnolog|digital|ai|ia|startup/.test(txt);
  const isSuave     = /femenina|suave|nude|pastel|delicad|calma/.test(txt);
  const isTerracota = /tierra|artesanal|cálid|calidez|terracota|rustic/.test(txt);

  // Estilo dominante (prioridad por mapeo)
  const style =
    (isElegante  && "elegante") ||
    (isTerracota && "terracota")||
    (isSuave     && "suave")    ||
    (isModerna   && "moderna")  ||
    "elegante"; // por defecto

  // Selección determinística dentro del grupo de paletas
  const group = PALETTES[style as keyof typeof PALETTES];
  const idx   = group.length > 0 ? hash(txt) % group.length : 0;
  const palette = group[idx];

  const font  = FONTS[style as keyof typeof FONTS];
  const voice = VOICES[style as keyof typeof VOICES];

  // Slogan simple pero coherente con el estilo (también determinístico)
  const slogansBase =
    style === "elegante"  ? [
      "Elegancia que comunica valor.",
      "Belleza sobria, impacto real.",
      "Prestigio que se nota.",
    ]
    : style === "moderna" ? [
      "Innovación con identidad.",
      "Claro. Útil. Memorables.",
      "Diseño que acelera decisiones.",
    ]
    : style === "suave"   ? [
      "Sutileza que enamora.",
      "Delicadeza con intención.",
      "Tu historia, en tonos suaves.",
    ]
    : [
      "Calidez artesanal que conecta.",
      "Texturas que cuentan historias.",
      "Raíz y carácter en cada detalle.",
    ];

  const slogan = slogansBase[ hash(txt + "|slogan") % slogansBase.length ];

  const posts = [
    { title: "Presenta tu promesa",  copy: "En una frase: ¿qué cambias en la vida de tu cliente? #brandingconpropósito" },
    { title: "Color en contexto",    copy: `Usa ${palette.colors[2]} para CTA y ${palette.colors[4]} para texto principal.` },
    { title: "CTA que convierte",    copy: "Pide una acción única y medible. Ej.: “Descarga tu guía visual”." },
  ];

  const canvaQuery   = encodeURIComponent(`${palette.name} ${font.heading} ${font.body} mockup brand kit`);
  const canvaSearch  = `https://www.canva.com/templates/?query=${canvaQuery}`;

  return NextResponse.json({
    style,
    palette,
    font,
    voice,
    slogan,
    posts,
    canvaSearch,
    tip: "Exporta esta guía a Canva y ajusta contraste (ideal AA).",
  });
}
