'use client';

import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function DownloadPage() {
  const searchParams = useSearchParams();
  const file = searchParams.get('file') || 'brand-kit-lite.zip';

  return (
    <main style={{ padding: '2rem', maxWidth: 760, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
        Descarga tu archivo
      </h1>
      <p style={{ marginBottom: 16 }}>
        Tu archivo está listo para descargar: <strong>{file}</strong>
      </p>
      <a href={`/api/zip?file=${encodeURIComponent(file)}`} download>
        <button
          style={{
            padding: '0.8rem 1.2rem',
            borderRadius: 12,
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Descargar ahora
        </button>
      </a>

      <p style={{ opacity: 0.7, marginTop: 16 }}>
        *Si no inicia la descarga, revisa bloqueadores de pop-ups o abre el enlace directo.
      </p>
    </main>
  );
}
