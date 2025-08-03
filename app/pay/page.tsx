'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Pay() {
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(()=>{
    const name = params.get('name');
    const slogan = params.get('slogan');
    const colors = params.get('colors');
    if (!name || !slogan || !colors) {
      setError('Missing data. Go back and generate your kit first.');
      return;
    }
    (async ()=> {
      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, slogan, colors: colors.split(',') }),
        });
        if (!res.ok) throw new Error('Checkout failed');
        const data = await res.json();
        if (data.url) window.location.href = data.url;
        else setError('Stripe URL not returned.');
      } catch (e:any) {
        setError(e.message || 'Something went wrong');
      }
    })();
  }, [params]);

  return (
    <main>
      <div className="card">
        <h2 className="font-serif text-xl mb-2">Redirecting to payment…</h2>
        {error && <div className="badge" style={{borderColor:'#c55', color:'#c55'}}>{error}</div>}
        <p className="text-sm opacity-70">If you are not redirected, return to the home page and try again.</p>
      </div>
    </main>
  );
}
