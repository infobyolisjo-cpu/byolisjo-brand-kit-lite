'use client';

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
    </main>
  );
}
