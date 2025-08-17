// app/download/page.tsx
import Link from "next/link";

type Params = {
  file?: string;
  name?: string;
  slogan?: string;
  colors?: string;
};

export default function DownloadPage({
  searchParams,
}: {
  searchParams: Params;
}) {
  const file = searchParams?.file || "brand-kit-lite.zip";
  const name = searchParams?.name || "";
  const slogan = searchParams?.slogan || "";
  const colors = searchParams?.colors || "";

  return (
    <main style={{ padding: "2rem", maxWidth: 760, margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
        Descarga tu archivo
      </h1>

      <div
        style={{
          border: "1px solid #e6dfd4",
          borderRadius: 10,
          padding: 16,
          background: "#fffefa",
        }}
      >
        <p style={{ marginBottom: 8 }}>
          <b>Archivo:</b> {file}
        </p>
        {name && (
          <p style={{ marginBottom: 4 }}>
            <b>Nombre:</b> {name}
          </p>
        )}
        {slogan && (
          <p style={{ marginBottom: 4 }}>
            <b>Slogan:</b> {slogan}
          </p>
        )}
        {colors && (
          <p style={{ marginBottom: 4 }}>
            <b>Colores:</b> {colors}
          </p>
        )}
      </div>

      <p style={{ marginTop: 16 }}>
        <Link href="/" className="navlink" style={{ textDecoration: "underline" }}>
          ← Volver al inicio
        </Link>
      </p>
    </main>
  );
}
