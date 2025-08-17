// app/api/generate/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Hash FNV-1a (determinístico por texto) */
function hash(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function hslToHex(h: number, s: number, l: number) {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2*l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c/2;
  let r=0,g=0,b=0;
  if (0 <= h && h < 60)       { r=c; g=x; b=0; }
  else if (60 <= h && h <120) { r=x; g=c; b=0; }
  else if (120<= h && h <180) { r=0; g=c; b=x; }
  else if (180<= h && h <240) { r=0; g=x; b=c; }
  else if (240<= h && h <300) { r=x; g=0; b=c; }
  else                        { r=c; g=0; b=x; }
  const toHex = (n:number)=> Math.round((n+m)*255).toString(16).padStart(2,"0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/** Genera una paleta desde el hash del prompt (sin keywords) */
function paletteFromTextKey(key: string) {
  const h = hash(key);
  const baseHue = h % 360;
  const mode = (h >> 3) % 4; // 0..3 elige esquema
  const satBase = 35 + (h % 30); // 35..64
  const lightBase = 35 + ((h >> 5) % 25); // 35..59

  // 4 esquemas: análogo, triádico, complementario suave, pastel
  let hues: number[];
  if (mode === 0) {
    hues = [0, 20, -20, 180, 320].map(d => (baseHue + d + 360) % 360);
  } else if (mode === 1) {
    hues = [0, 120, 240, 30, 300].map(d => (baseHue + d) % 360);
  } else if (mode === 2) {
    hues = [0, 180, 10, -10, 220].map(d => (baseHue + d + 360) % 360);
  } else {
    // pastel (baja saturación, más luz)
    const s = Math.max(18, satBase - 18);
    const l = Math.min(78, lightBase + 18);
    const hs = [0, 25, 200, 320, 50].map(d => (baseHue + d + 360) % 360);
    return {
      name: `Pastel ${baseHue}`,
      colors: hs.map((hh, i) => hslToHex(hh, s + (i%2?4:0), l - (i%3?0:3))),
    };
  }

  const colors = hues.map((hh, i) => {
    const s = Math.min(70, satBase + (i===1?8:i===2?4:0));
    const l = Math.min(72, lightBase + (i===0?0:i===1?6:i===2?10:4));
    return hslToHex(hh, s, l);
  });

  // Acento oro si cae demasiado neutra
  if (((h >> 9) % 5) === 0) colors[4] = "#B08D57";

  return { name: `Scheme ${mode}-${baseHue}`, colors: Array.from(new Set(colors)).slice(0,5) };
}

const HEADINGS = [
  "Cormorant Garamond","Playfair Display","DM Serif Display","Libre Baskerville","Merriweather","Cinzel",
  "Marcellus","Prata","Lora","Cormorant Infant"
];
const BODIES = [
  "Inter","Sora","Manrope","Nunito","Work Sans","Source Sans 3","Poppins","Rubik","Plus Jakarta Sans","Urbanist"
];

const VOICES = [
  "Elegante y clara; orientada a valor percibido y resultados.",
  "Directa, útil y accionable; evita adornos innecesarios.",
  "Humana y cercana; explica con ejemplos simples.",
  "Cálida y honesta; resalta lo artesanal y auténtico."
];

const SLOGAN_TEMPLATES = [
  "{K1} con {K2}.",
  "Donde {K1} encuentra {K2}.",
  "Hecho para {K1}, pensado en {K2}.",
  "Tu {K1}, con {K2}.",
  "Diseño que impulsa {K1} y {K2}.",
  "Esencia de {K1}, actitud de {K2}."
];

/** Extrae 2 palabras del prompt (sin depender de keywords fijas) */
function extractKeywords(txt: string) {
  const words = (txt || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(w => w.length > 3);
  const uniq = Array.from(new Set(words));
  const k1 = uniq[0] || "marca";
  const k2 = uniq[1] || "identidad";
  return [k1, k2];
}

type Input = { prompt: string; seed?: string | number };

export async function POST(req: Request) {
  const { prompt, seed } = (await req.json()) as Input;
  const txt = (prompt || "").trim();
  const salt = (seed ?? "").toString();
  const key = txt + "|" + salt;

  // 1) Paleta desde el hash del texto
  const palette = paletteFromTextKey(key);

  // 2) Fuentes determinísticas
  const h = hash(key);
  const heading = HEADINGS[h % HEADINGS.length];
  const body    = BODIES[(h >> 7) % BODIES.length];

  // 3) Voz y slogan
  const voice = VOICES[(h >> 11) % VOICES.length];
  const [k1, k2] = extractKeywords(txt);
  const tmpl = SLOGAN_TEMPLATES[(h >> 13) % SLOGAN_TEMPLATES.length];
  const slogan = tmpl.replace("{K1}", capitalize(k1)).replace("{K2}", k2);

  // 4) Posts
  const posts = [
    { title: "Promesa clara",  copy: "En una frase: ¿qué cambias en la vida de tu cliente? #brandingconpropósito" },
    { title: "Color en contexto", copy: `Usa ${palette.colors[2]} para CTA y ${palette.colors[4] || palette.colors[0]} para texto principal.` },
    { title: "CTA único",      copy: "Pide una acción medible. Ej.: “Descarga tu guía visual”." },
  ];

  const canvaQuery  = encodeURIComponent(`${palette.name} ${heading} ${body} mockup brand kit`);
  const canvaSearch = `https://www.canva.com/templates/?query=${canvaQuery}`;

  return NextResponse.json(
    { palette, font: { heading, body }, voice, slogan, posts, canvaSearch, tip: "Copia los colores y pruébalos en Canva; revisa contraste (ideal AA)." },
    { headers: { "Cache-Control": "no-store" } }
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

