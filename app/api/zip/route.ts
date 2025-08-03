import JSZip from 'jszip';
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
