import JSZip from 'jszip';

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

