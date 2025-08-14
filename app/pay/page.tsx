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
}
