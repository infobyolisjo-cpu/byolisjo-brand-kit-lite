// app/page.tsx
"use client";
import { useState } from "react";

type Kit = {
  palette: { name: string; colors: string[] };
  font: { heading: string; body: string };
  voice: string;
  slogan: string;
  posts: { title: string; copy: string }[];
  canvaSearch: string;
  tip: string;
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Kit | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error("No se pudo generar el kit");
      const json = (await res.json()) as Kit;
      setData(json);
    } catch (err: any) {
      setError(err.message || "Error generando kit");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen" style={{ background: "#efe6d8", color: "#1f1b16" }}>
      <div className="mx-auto" style={{ maxWidth: 900, padding: "28px 16px" }}>
        <h1 className="font-serif" style={{ fontSize: 36, marginBottom: 6 }}>
          ByOlisJo Brand Kit Lite
        </h1>
        <p style={{ opacity: 0.85, marginBottom: 18 }}>
          Describe tu marca y obtén un kit visual & de voz en segundos.
        </p>

        {/* Tarjeta del formulario */}
        <section className="card" style={{ padding: 16, borderRadius: 16, background: "#fffaf2", border: "1px solid #e4d8c6", boxShadow: "0 10px 30px rgba(0,0,0,.03)" }}>
          <form onSubmit={onGenerate}>
            <label style={{ display: "block", fontSize: 14, marginBottom: 8 }}>Describe tu marca</label>
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`ej: "moderna, femenina, elegante, beige y dorado, joyas artesanales"`}
              style={{
                width: "100%",
                borderRadius: 12,
                border: "1px solid #d6c8b3",
                background: "#fffdfa",
                padding: "10px 12px",
              }}
            />
            <button
              disabled={loading}
              style={{
                marginTop: 12,
                borderRadius: 12,
                border: "1px solid #b08d57",
                background: "linear-gradient(180deg,#f9f4ec,#efe6d9)",
                padding: "10px 14px",
                cursor: "pointer",
              }}
            >
              {loading ? "Generando…" : "Generar Kit"}
            </button>
          </form>
        </section>

        {error && (
          <p style={{ marginTop: 14, color: "#a31616" }}>
            {error}
          </p>
        )}

        {data && (
          <section className="previewGrid" style={{ display: "grid", gap: 16, marginTop: 20 }}>
            {/* Paleta */}
            <div className="previewCard" style={{ background: "#ffffff", border: "1px solid #e6dfd4", borderRadius: 16, padding: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600 }}>
                Paleta — {data.palette.name}
              </h2>
              <div className="swatchRow" style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                {data.palette.colors.map((c) => (
                  <div key={c} title={c} style={{ height: 34, width: 34, borderRadius: 10, border: "1px solid #d6c8b3", background: c }} />
                ))}
              </div>
              <p style={{ marginTop: 8, fontSize: 13, opacity: 0.85 }}>
                {data.palette.colors.join(" · ")}
              </p>
            </div>

            {/* Tipografías */}
            <div className="previewCard" style={{ background: "#ffffff", border: "1px solid #e6dfd4", borderRadius: 16, padding: 16 }}>
              <h3 style={{ fontWeight: 600 }}>Tipografías</h3>
              <p style={{ opacity: 0.9, fontSize: 14 }}>
                Heading: <b>{data.font.heading}</b> — Body: <b>{data.font.body}</b>
              </p>
            </div>

            {/* Voz */}
            <div className="previewCard" style={{ background: "#ffffff", border: "1px solid #e6dfd4", borderRadius: 16, padding: 16 }}>
              <h3 style={{ fontWeight: 600 }}>Voz de marca</h3>
              <p style={{ opacity: 0.9 }}>{data.voice}</p>
            </div>

            {/* Slogan */}
            <div className="previewCard" style={{ background: "#ffffff", border: "1px solid #e6dfd4", borderRadius: 16, padding: 16 }}>
              <h3 style={{ fontWeight: 600 }}>Slogan propuesto</h3>
              <p style={{ opacity: 0.9 }}>{data.slogan}</p>
            </div>

            {/* Posts */}
            <div className="previewCard" style={{ background: "#ffffff", border: "1px solid #e6dfd4", borderRadius: 16, padding: 16 }}>
              <h3 style={{ fontWeight: 600 }}>3 posts de arranque</h3>
              <ul style={{ marginTop: 8, paddingLeft: 18, opacity: 0.95 }}>
                {data.posts.map((p, i) => (
                  <li key={i}>
                    <b>{p.title}:</b> {p.copy}
                  </li>
                ))}
              </ul>
            </div>

            {/* Canva */}
            <div className="previewFull" style={{ gridColumn: "1 / -1" }}>
              <a
                href={data.canvaSearch}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-block",
                  borderRadius: 12,
                  border: "1px solid #b08d57",
                  background: "linear-gradient(180deg,#f9f4ec,#efe6d9)",
                  padding: "10px 14px",
                }}
              >
                Abrir ideas relacionadas en Canva
              </a>
              <p style={{ opacity: 0.7, fontSize: 13, marginTop: 8 }}>{data.tip}</p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

