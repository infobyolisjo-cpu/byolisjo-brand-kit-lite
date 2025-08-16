import JSZip from 'jszip';
<<<<<<< HEAD

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const file = sanitizeFileName(searchParams.get('file') || 'brand-kit-lite.zip');

  const zip = new JSZip();
  zip.file('README.txt', 'ByOlisJo — Brand Kit Lite (ejemplo).');
  zip.folder('logos')?.file('logo.txt', 'Aquí irían tus logos.');
  zip.folder('colores')?.file('paleta.txt', '#BDA9C8 (lila-nude), #F5EFEF (nude)');
  zip.folder('tipografia')?.file('tipos.txt', 'Serif para titulares, sans para cuerpo.');

  const content = await zip.generateAsync({ type: 'nodebuffer' });

  return new Response(content, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${file}"`
    }
  });
}

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

=======
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, slogan, colors } = await req.json();

    if (!name || !slogan || !colors || !Array.isArray(colors) || colors.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Missing data' }), { status: 400 });
    }

    const primary = colors[0];

    const zip = new JSZip();
    // Archivos de ejemplo incluidos en el ZIP
    zip.file('colors.txt', colors.join('\n'));
    zip.file('slogan.txt', slogan);
    zip.file(
      'logo.svg',
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400">
        <rect width="100%" height="100%" fill="#FFFFFF"/>
        <text x="80" y="230" font-family="Georgia, serif" font-size="160" font-weight="400" fill="${primary}">${name}</text>
      </svg>`
    );

    const content = await zip.generateAsync({ type: 'nodebuffer' });

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${name.replace(/\s+/g, '_')}_BrandKit.zip"`,
      },
    });
  } catch (e: any) {
    return new NextResponse(JSON.stringify({ error: e.message || 'Server error' }), { status: 500 });
  }
}
>>>>>>> 4519612185e08ac69cc8235c6adeafe63cbd010e
