<<<<<<< HEAD
'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function PayPage() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const name = searchParams.get('name')
    const slogan = searchParams.get('slogan')
    const colors = searchParams.get('colors')

    console.log('Nombre:', name)
    console.log('Slogan:', slogan)
    console.log('Colores:', colors)
  }, [searchParams])

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Procesando pago...</h1>
      <p>Estamos creando tu Kit de Marca personalizado. Si estás en modo test, verás la redirección automática.</p>
    </div>
  )
=======
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
>>>>>>> 4519612185e08ac69cc8235c6adeafe63cbd010e
}
