// app/api/generate/route.ts
import { NextResponse } from "next/server";

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

/* Utilidades determinísticas */
function hash(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function buildPalette(seed: number): Palette {
  const baseHue = seed % 360;
  const s = 30 + (seed % 20);
  const l = 38 + (Math.floor(seed / 7) % 16);
  const colors = [
    hslToHex((baseHue + 0) % 360, s + 8, l + 4),
    hslToHex((baseHue + 22) % 360, s + 12, l + 8),
    hslToHex((baseHue + 185) % 360, s + 6, l),
    hslToHex((baseHue + 310) % 360, s + 10, l - 2),
    hslToHex((baseHue + 355) % 360, s + 4, l - 6),
  ];

  const hue = baseHue;
  const name =
    hue < 25  ? "Caramelo & Crema" :
    hue < 70  ? "Dorado Suave" :
    hue < 150 ? "Verde Néctar" :
    hue < 210 ? "Azules Modernos" :
    hue < 270 ? "Lilas & Lavanda" :
    hue < 320 ? "Rosa Arcilla" :
                "Nude Premium";

  return { name, colors };
}

const FONTS: Font[] = [
  { heading: "Cormorant Garamond", body: "Inter" },
  { heading: "DM Serif Display",   body: "Sora"  },
  { heading: "Playfair Display",   body: "Manrope" },
  { heading: "Libre Baskerville",  body: "Nunito"  },
];

const VOICES = [
  "Elegante, clara, orientada a valor percibido.",
  "Directa y accionable; evita adornos.",
  "Humana y empática; explica con ejemplos.",
  "Cálida y artesanal, honesta y cercana.",
];

function pick<T>(arr: T[], seed: number) { return arr[seed % arr.length]; }

function buildSlogan(seed: number, brand: string) {
  const lines = [
    "Elegancia que comunica valor.",
    "Innovación con identidad.",
    "Sutileza que enamora.",
    "Calidez artesanal que conecta.",
    "Claro. Útil. Memorables.",
    "Belleza sobria, impacto real.",
  ];
  const s = pick(lines, seed);
  return (seed % 2 === 0 && brand.trim()) ? `${s} — ${brand.trim()}.` : s;
}

function buildProposal(prompt: string, variantIndex: number): Proposal {
  const seed = hash(`${prompt}#${variantIndex}`);
  const palette = buildPalette(seed);
  const font = pick(FONTS, seed >> 3);
  const voice = pick(VOICES, seed >> 5);
  const style = ["elegante", "moderna", "suave", "terracota"][seed % 4];

  const posts = [
    { title: "Presenta tu promesa",  copy: "En una frase: ¿qué cambias en la vida de tu cliente?" },
    { title: "Color en contexto",    copy: `Usa ${palette.colors[2]} para CTA y ${palette.colors[4]} para texto principal.` },
    { title: "CTA que convierte",    copy: "Pide una acción única y medible. Ej.: “Descarga tu guía visual”." },
  ];

  const canvaQuery  = encodeURIComponent(`${palette.name} ${font.heading} ${font.body} brand kit mockup`);
  const canvaSearch = `https://www.canva.com/templates/?query=${canvaQuery}`;

  return {
    style,
    palette,
    font,
    voice,
    slogan: buildSlogan(seed, prompt),
    posts,
    canvaSearch,
    tip: "Abre en Canva y ajusta contraste (ideal AA).",
  };
}

/* Handler: soporta n por query o body y SIEMPRE devuelve un array */
export async function POST(req: Request) {
  try {
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

    const prompt: string = (body?.prompt || "").toString();

    if (!prompt.trim()) {
      return NextResponse.json([], { status: 200 });
    }

    const list: Proposal[] = [];
    for (let i = 0; i < n; i++) list.push(buildProposal(prompt, i));
    return NextResponse.json(list, { status: 200 });
  } catch {
    // Importante: el cliente espera un ARRAY
    return NextResponse.json([], { status: 200 });
  }
}
