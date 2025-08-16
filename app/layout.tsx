<<<<<<< HEAD
// app/layout.tsx
import './globals.css';
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-serif',
});
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'ByOlisJo Brand Kit Lite',
  description: 'Premium & minimal — beige & gold aesthetic',
};

const colors = {
  bg: '#efe6d8',
  panel: '#f6eee2',
  text: '#201810',
  line: '#e0d2bd',
  gold: '#b89e7a',
  white: '#fff',
=======
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ByOlisJo Brand Kit Lite',
  description: 'Generate a quick brand kit: palette, slogan, and logo',
>>>>>>> 4519612185e08ac69cc8235c6adeafe63cbd010e
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
<<<<<<< HEAD
    <html lang="es">
      <body
        className={`${inter.variable} ${playfair.variable}`}
        style={{
          background: colors.bg,
          color: colors.text,
          fontFamily: 'var(--font-sans)',
          margin: 0,
        }}
      >
        {/* HEADER */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 20,
            borderBottom: `1px solid ${colors.line}`,
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(246,238,226,0.9) 100%)',
            backdropFilter: 'saturate(140%) blur(4px)',
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: '0 auto',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            {/* Marca */}
            <a
              href="/"
              style={{
                fontWeight: 800,
                textDecoration: 'none',
                color: colors.text,
                letterSpacing: '.2px',
              }}
              aria-label="Ir al inicio"
            >
              ByOlisJo<span style={{ fontWeight: 500, opacity: 0.85 }}>Brand Kit Lite</span>
            </a>

            {/* Nav (sin event handlers, hover por CSS) */}
            <nav style={{ display: 'flex', gap: 10 }}>
              <a
                href="/"
                className="navlink"
                style={{
                  padding: '8px 14px',
                  borderRadius: '12px',
                  border: `1px solid ${colors.gold}`,
                  background: colors.white,
                  color: colors.text,
                  textDecoration: 'none',
                  boxShadow: '0 1px 0 rgba(0,0,0,0.03)',
                  fontWeight: 600,
                }}
              >
                Inicio
              </a>
              <a
                href="/productos"
                className="navlink"
                style={{
                  padding: '8px 14px',
                  borderRadius: '12px',
                  border: `1px solid ${colors.gold}`,
                  background: colors.white,
                  color: colors.text,
                  textDecoration: 'none',
                  boxShadow: '0 1px 0 rgba(0,0,0,0.03)',
                  fontWeight: 600,
                }}
              >
                Productos
              </a>
              <a
                href="/download"
                className="navlink"
                style={{
                  padding: '8px 14px',
                  borderRadius: '12px',
                  border: `1px solid ${colors.gold}`,
                  background: colors.white,
                  color: colors.text,
                  textDecoration: 'none',
                  boxShadow: '0 1px 0 rgba(0,0,0,0.03)',
                  fontWeight: 600,
                }}
              >
                Descargas
              </a>
            </nav>
          </div>
        </header>

        {/* CONTENIDO */}
        <main style={{ minHeight: '72vh' }}>{children}</main>

        {/* FOOTER */}
        <footer
          style={{
            borderTop: `1px solid ${colors.line}`,
            background: colors.panel,
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: '0 auto',
              padding: '18px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
              fontSize: 14,
            }}
          >
            <span>© {new Date().getFullYear()} ByOlisJo</span>
            <span style={{ opacity: 0.9 }}>Premium & minimal — beige & gold aesthetic</span>
          </div>
        </footer>
=======
    <html lang="en">
      <body className="min-h-screen bg-[#f7f2ea] text-[#1f1b16]">
        <div className="max-w-3xl mx-auto p-6">
          <header className="py-6">
            <h1 className="text-2xl md:text-3xl font-serif tracking-wide">
              <span className="mr-2">ByOlisJo</span>
              <span className="font-light">Brand Kit Lite</span>
            </h1>
            <p className="text-sm opacity-70 mt-1">Premium & minimal — beige & gold aesthetic</p>
          </header>
          {children}
          <footer className="py-10 text-xs opacity-70">
            © {new Date().getFullYear()} ByOlisJo. For testing purposes only.
          </footer>
        </div>
>>>>>>> 4519612185e08ac69cc8235c6adeafe63cbd010e
      </body>
    </html>
  );
}
