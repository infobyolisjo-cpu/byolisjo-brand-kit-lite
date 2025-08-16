// app/api/zip/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Sencillo: entregamos un archivo de texto (evita dependencias de zip por ahora)
export async function GET() {
  const content = `ByOlisJo Brand Kit Lite\nGracias por usar el generador.`;
  const data = new TextEncoder().encode(content);

  return new NextResponse(data, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="brand-kit-lite.txt"',
      'Cache-Control': 'no-store',
    },
  });
}
