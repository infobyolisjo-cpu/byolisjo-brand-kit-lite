export async function POST(req: Request) {
  const { prompt } = await req.json() as { prompt: string };
  const txt = (prompt || "").trim();

  // Generaremos 3 variaciones con "saltos" diferentes
  const results = [0, 1, 2].map(salt => {
    const key = txt + "|" + salt;

    const palette = paletteFromTextKey(key);
    const h = hash(key);
    const heading = HEADINGS[h % HEADINGS.length];
    const body    = BODIES[(h >> 7) % BODIES.length];
    const voice   = VOICES[(h >> 11) % VOICES.length];

    const [k1, k2] = extractKeywords(txt);
    const tmpl = SLOGAN_TEMPLATES[(h >> 13) % SLOGAN_TEMPLATES.length];
    const slogan = tmpl.replace("{K1}", capitalize(k1)).replace("{K2}", k2);

    const posts = [
      { title: "Promesa clara", copy: "En una frase: ¿qué cambias en la vida de tu cliente?" },
      { title: "Color en contexto", copy: `Usa ${palette.colors[2]} para CTA y ${palette.colors[4]}` },
      { title: "CTA único", copy: "Ejemplo: Descarga tu guía visual." },
    ];

    const canvaQuery  = encodeURIComponent(`${palette.name} ${heading} ${body} mockup brand kit`);
    const canvaSearch = `https://www.canva.com/templates/?query=${canvaQuery}`;

    return { palette, font: { heading, body }, voice, slogan, posts, canvaSearch };
  });

  return NextResponse.json({ options: results });
}

