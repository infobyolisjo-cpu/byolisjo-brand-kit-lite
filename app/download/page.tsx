// app/download/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';

export default function DownloadPage() {
  const search = useSearchParams();
  const name   = search.get('name')   || 'Tu Marca';
  const slogan = search.get('slogan') || '';
  const colors = search.get('colors') || '';

  return (
    <main style={{ padding: '2rem', maxWidth: 760, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
        Descarga para {name}
      </h1>
      {slogan && <p style={{ opacity: .8, marginBottom: 12 }}>Slogan: {slogan}</p>}
      {colors && <p style={{ opacity: .8, marginBottom: 12 }}>Colores: {colors}</p>}

      <a
        href="/api/zip"
        style={{ display: 'inline-block', padding: '10px 14px', border: '1px solid #d6c8b3', borderRadius: 10 }}
      >
        Descargar archivo
      </a>
    </main>
  );
}

