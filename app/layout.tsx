// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ByOlisJo Brand Kit Lite",
  description:
    "Genera tu kit de marca (paleta, tipografías, voz y slogan) en segundos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        style={{
          background: "#efe6d8",
          color: "#1f1b16",
          margin: 0,
          fontFamily: "Inter, system-ui, Arial, sans-serif",
        }}
      >
        <header
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <strong>ByOlisJo Brand Kit Lite</strong>
          <nav style={{ display: "flex", gap: 12 }}>
            <a href="/" style={{ textDecoration: "none" }}>
              Inicio
            </a>
          </nav>
        </header>

        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px 40px" }}>
          {children}
        </main>

        <footer
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "16px",
            opacity: 0.8,
          }}
        >
          © {new Date().getFullYear()} ByOlisJo — Premium & minimal
        </footer>
      </body>
    </html>
  );
}
