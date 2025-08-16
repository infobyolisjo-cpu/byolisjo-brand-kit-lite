// app/download/page.tsx
"use client";
import { useSearchParams } from "next/navigation";

export default function DownloadPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") ?? "";
  const slogan = searchParams.get("slogan") ?? "";
  const colors = (searchParams.get("colors") ?? "").split(",").filter(Boolean);

  return (
    <main style={{ padding: "2rem", maxWidth: 760, margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>Descarga tu Kit</h1>

      <p style={{ marginBottom: 12 }}>
        <b>Nombre:</b> {name || "—"}
      </p>
      <p style={{ marginBottom: 12 }}>
        <b>Slogan:</b> {slogan || "—"}
      </p>

      <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        {colors.map((c) => (
          <div
            key={c}
            title={c}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: "1px solid rgba(0,0,0,.1)",
              background: c,
            }}
          />
        ))}
      </div>

      <p style={{ opacity: 0.8 }}>
        * Versión lite para prueba. Luego añadimos exportación a ZIP/PDF.
      </p>
    </main>
  );
}
