'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Pay() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const result = searchParams.get('result');
    if (result) {
      setStatus(result);
    }
  }, [searchParams]);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Pago</h1>
      {status ? (
        <p>Estado del pago: <strong>{status}</strong></p>
      ) : (
        <p>No hay información del pago.</p>
      )}
    </main>
  );
}

