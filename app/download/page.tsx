'use client';
<<<<<<< HEAD

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
=======
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Download() {
  const params = useSearchParams();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(()=>{
    const name = params.get('name') || '';
    const slogan = params.get('slogan') || '';
    const colorsParam = params.get('colors') || '';
    const colors = colorsParam ? colorsParam.split(',') : [];

    if (!name || !slogan || colors.length === 0) {
      setError('Missing data. Please regenerate and pay again.');
      return;
    }

    (async ()=>{
      const res = await fetch('/api/zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slogan, colors })
      });
      if (!res.ok) {
        setError('Failed to create ZIP');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name.replace(/\s+/g,'_')}_BrandKit.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setReady(true);
    })();
  }, [params]);

  return (
    <main>
      <div className="card">
        <h2 className="font-serif text-xl mb-2">Preparing your download…</h2>
        {error ? <div className="badge" style={{borderColor:'#c55', color:'#c55'}}>{error}</div> : <p className="text-sm opacity-70">Your ZIP will download automatically.</p>}
        {ready && <p className="text-sm opacity-70">If the download didn't start, refresh this page.</p>}
      </div>
>>>>>>> 4519612185e08ac69cc8235c6adeafe63cbd010e
    </main>
  );
}
