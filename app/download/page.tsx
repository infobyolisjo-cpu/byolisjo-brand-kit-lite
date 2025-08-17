// app/download/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function DownloadInner() {
  const searchParams = useSearchParams();

  const file   = searchParams.get('file')   ?? 'brand-kit-lite.zip';
  const name   = searchParams.get('name')   ?? 'Tu Marca';
  const slogan = searchParams.get('slogan') ?? '';
  const colors = searchParams.get('colors') ?? '';
  const list   = colors ? colors.split(',') : [];

  // Si tienes un endpoint /api/zip que genera el zip por GET con query params,
  // dejamos un link directo. Si es POST, este botón puede abrir la descarga de otra forma.
  const zipHref = `/api/zip?name=${encodeURIComponent(name)}&slogan=${encodeURIComponent(slogan)}&colors=${encodeURIComponent(colors)}`;

  return (
    <main style={{ padding: '2rem', maxWidth: 760, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Descarga tu archivo</h1>

      <div className="card" style={{ marginBottom: 16 }}>
        <p style={{ marginBottom: 8 }}>
          <b>Marca:</b> {name}
        </p>
        {slogan && <p style={{ marginBottom: 8 }}><b>Slogan:</b> {slogan}</p>}
        {list.length > 0 && (
          <div>
            <b>Colores:</b>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {list.map((c) => (
                <div key={c} title={c} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e6dfd4', background: c }} />
              ))}
            </div>
          </div>
        )}
      </div>

      <a
        href={zipHref}
        className="btn"
        style={{ display: 'inline-block', padding: '10px 14px', border: '1px solid #e6dfd4', borderRadius: 10 }}
      >
        Descargar {file}
      </a>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<main style={{ padding: '2rem' }}>Cargando…</main>}>
      <DownloadInner />
    </Suspense>
  );
}

