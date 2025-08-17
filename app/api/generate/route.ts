// app/api/generate/route.ts
import { NextResponse } from "next/server";

/* =========================
   Tipos
========================= */
type Palette = { name: string; colors: string[] };
type Font = { heading: string; body: string };
type Proposal = {
  style: string;
  palette: Palette;
  font: Font;
  voice: string;
  slogan: string;
  posts: { title: string; copy: string }[];
  canvaSearch: string;
  tip: string;
};

/* =========================
   Utilidades base
========================= */
// Hash determinístico rápido (FNV-like)
function hash(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// PRNG simple (xorshift32) a partir de una semilla
function rng(seed: number) {
  let x = seed || 123456789;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    // 0..1
    return ((x >>> 0) % 1_000_000) / 1_000_000;
  };
}

// HSL -> HEX
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function pick<T>(arr: T[], seedNumber: number) {
  const idx = Math.abs(seedNumber) % arr.length;
  return arr[idx];
}

/* =========================
   Catálogos ampliados
========================= */
const FONT_SET: Font[] = [
  { heading: "Cormorant Garamond", body: "Inter" },
  { heading: "DM Serif Display",   body: "Sora"  },
  { heading: "Playfair Display",   body: "Manrope" },
  { heading: "Libre Baskerville",  body: "Nunito"  },
  { heading: "Montserrat",         body: "Lato"    },
  { heading: "Raleway",            body: "Roboto"  },
  { heading: "Oswald",             body: "Open Sans" },
];

const VOICE_SET = [
  "Elegante, clara, orientada a valor percibido.",
  "Directa y accionable; evita adornos.",
  "Humana y empática; explica con ejemplos.",
  "Cálida y artesanal, honesta y cercana.",
  "Minimalista y clara; va al grano.",
  "Inspiradora y aspiracional.",
  "Divertida y cercana; lenguaje fresco.",
  "Premium y exclusiva, tono aspiracional."
];

const STYLE_SET = ["elegante", "moderna", "suave", "terracota", "vibrante", "orgánica"];

/* Paletas fijas por estilo (semillas para mezcla) */
const FIXED_PALETTES: Record<string, Palette[]> = {
  elegante: [
    { name: "Beige & Gold Premium", colors: ["#F5EFE6","#E8D9C5","#C3A572","#8C6B3E","#27231F"] },
    { name: "Marfil & Caramelo",    colors: ["#FBF7F1","#E7D9C8","#BDA07B","#8B6A46","#2A2420"] },
  ],
  moderna: [
    { name: "Azules Tech",          colors: ["#E7F1FF","#CFE2FF","#7EB3FF","#2B6CB0","#101622"] },
    { name: "Neón Sutil",           colors: ["#F3FFF7","#D6FFE7","#59E3A7","#1E7F5C","#101A16"] },
  ],
  suave: [
    { name: "Lila & Nude Soft",     colors: ["#F3ECF7","#E6D9EE","#C9B7D6","#9C84AE","#2C2730"] },
    { name: "Rosa & Arena",         colors: ["#FFF1F3","#FADDE1","#F3B6C1","#C87993","#2C2224"] },
  ],
  terracota: [
    { name: "Terracota & Rosa",     colors: ["#F9EDEA","#F3C7BE","#E39F8C","#B56A55","#2B1F1D"] },
    { name: "Arcilla & Oliva",      colors: ["#FAF3E7","#EBD8BF","#C88C5A","#6E7F58","#2A271F"] },
  ],
  vibrante: [
    { name: "Pop Citrus",           colors: ["#FFF6D9","#FFE07A","#FF9F1C","#2EC4B6","#011627"] },
  ],
  orgánica: [
    { name: "Bosque & Musgo",       colors: ["#F2F6F1","#DCE8DE","#9BBE9C","#547B5B","#1F2A22"] },
  ],
};

/* =========================
   Generadores de variación
========================= */
// Paleta generativa mezclada con catálogo fijo
function buildPalette(seedNum: number, style: string, vary: number): Palette {
  const r = rng(seedNum ^ vary);
  // base fija por estilo, elegida de forma estable
  const baseList = FIXED_PALETTES[style] || FIXED_PALETTES["moderna"];
  const base = baseList[Math.floor(r() * baseList.length)];

  // variación ligera del tono para diversidad
  const baseHue = Math.floor((r() * 360) + (seedNum % 60)) % 360;
  const s = 28 + Math.floor(r() * 22); // 28..50
  const l = 38 + Math.floor(r() * 14); // 38..52

  const generative = [
    hslToHex((baseHue + 0) % 360, s + 8, l + 4),
    hslToHex((baseHue + 22) % 360, s + 12, l + 8),
    hslToHex((baseHue + 185) % 360, s + 6, l),
    hslToHex((baseHue + 310) % 360, s + 10, l - 2),
    hslToHex((baseHue + 355) % 360, s + 4, l - 6),
  ];

  // mezcla: 2 del catálogo + 3 generativos (orden barajado)
  const mixed = [
    ...base.colors.slice(0, 2),
    ...generative.slice(0, 3)
  ];

  // desduplicar y recortar a 5
  const unique = Array.from(new Set(mixed)).slice(0, 5);

  const nameHints = {
    elegante: "Premium",
    moderna: "Modernos",
    suave: "Suaves",
    terracota: "Arcilla",
    vibrante: "Vivo",
    orgánica: "Orgánico",
  } as const;

  const name = `${base.name.split("&")[0].trim()} & ${nameHints[style as keyof typeof nameHints] || "Mix"}`;
  return { name, colors: unique };
}

// Extraer palabras clave (para slogans)
function keywords(s: string) {
  return (s || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(w => w.length > 3)
    .slice(0, 6);
}

// Slogan con variación y palabras del prompt
function buildSlogan(seedNum: number, brandDesc: string) {
  const r = rng(seedNum ^ 0x9e3779b9);
  const kws = keywords(brandDesc);
  const k1 = kws[0] || "diseño";
  const k2 = kws[1] || "elegancia";
  const k3 = kws[2] || "identidad";

  const patterns = [
    `${k1} que inspira, ${k2} que perdura.`,
    `${k1} ${k2}, esencia ${k3}.`,
    `Donde ${k1} y ${k2} se encuentran.`,
    `Detalles ${k2}, estilo ${k3}.`,
    `${k1} con alma ${k2}.`,
    `Elegancia ${k3} con carácter ${k2}.`,
    `Creado para mentes que aman lo ${k1}.`,
    `Belleza ${k2}, actitud ${k3}.`,
    `Más que ${k1}.`,
    `Tu lenguaje de ${k1} en clave ${k3}.`,
  ];
  return patterns[Math.floor(r() * patterns.length)];
}

/* =========================
   Propuesta completa
========================= */
function buildProposal(prompt: string, variantIndex: number, requestSalt: number): Proposal {
  // Semilla base por prompt + variante, mezclada con un "salt" por request para diversidad
  const baseSeed = hash(`${prompt}#${variantIndex}`);
  const seedNum = baseSeed ^ requestSalt;

  // estilo visual
  const style = pick(STYLE_SET, seedNum);

  // paleta (mezcla catálogo + generativa)
  const palette = buildPalette(seedNum, style, variantIndex);

  // tipografías y voz
  const font = pick(FONT_SET, seedNum >> 3);
  const voice = pick(VOICE_SET, seedNum >> 5);

  // posts
  const posts = [
    { title: "Presenta tu promesa",  copy: "En una frase: ¿qué cambias en la vida de tu cliente?" },
    { title: "Color en contexto",    copy: `Usa ${palette.colors[2]} para CTA y ${palette.colors[4]} para títulos.` },
    { title: "CTA que convierte",    copy: "Pide una acción única y medible. Ej.: “Descarga tu guía visual”." },
  ];

  const canvaQuery  = encodeURIComponent(`${palette.name} ${font.heading} ${font.body} ${style} brand kit`);
  const canvaSearch = `https://www.canva.com/templates/?query=${canvaQuery}`;

  return {
    style,
    palette,
    font,
    voice,
    slogan: buildSlogan(seedNum, prompt),
    posts,
    canvaSearch,
    tip: "Abre en Canva y ajusta contraste (ideal AA).",
  };
}

/* =========================
   Handler API (POST)
========================= */
export async function POST(req: Request) {
  try {
    // lee n desde querystring y/o body
    let n = 1;
    try {
      const url = new URL(req.url);
      const qp = url.searchParams.get("n");
      if (qp) n = Number(qp);
    } catch {}
    let body: any = {};
    try { body = await req.json(); } catch {}

    if (typeof body?.n === "number") n = body.n;
    n = Math.max(1, Math.min(12, Number.isFinite(n) ? n : 1));

    const prompt: string = (body?.prompt || "").toString().trim();
    if (!prompt) {
      return NextResponse.json([], { status: 200 });
    }

    // “sal” por request: aporta variación entre clics, pero estable dentro del mismo request
    const requestSalt =
      (Date.now() & 0xffff) ^
      Math.floor(Math.random() * 0xffff);

    const list: Proposal[] = [];
    for (let i = 0; i < n; i++) {
      list.push(buildProposal(prompt, i, requestSalt));
    }

    return NextResponse.json(list, { status: 200 });
  } catch (e: any) {
    // devolvemos 200 con error para no romper el cliente
    return NextResponse.json({ error: e?.message || "server error" }, { status: 200 });
  }
}
