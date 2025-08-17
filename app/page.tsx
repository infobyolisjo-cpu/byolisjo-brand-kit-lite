// app/page.tsx
"use client";
import { useState } from "react";

type Kit = {
  seed: number;
  palette: { name: string; colors: string[] };
  font: { heading: string; body: string };
  voice: string;
  slogan: string;
  posts: { title: string; copy: string }[];
  canvaSearch: string;
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextStartSeed, setNextStartSeed] = useState(0);

  async function fetchKits(mode: "replace" | "append", count = 3) {
    if (!prompt.trim()) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          count,
          startSeed: mode === "replace" ? 0 : nextStartSeed
        }),
      });
      if (!res.ok) throw new Error("No se pudo generar");
      const json = await res.json();
      const list = json.options as Kit[];
      setNextStartSeed(json.nextStartSeed as number);
      setKits(mode === "replace" ? list : [...kits, ...list]);
    } catch (e: any) {
      setError(e?.message || "Error generando kits");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen" style={{ background: "#efe6d8", color: "#1f1b16" }}>
      <div className="mx-auto" style={{ maxWidth: 1000, padding: "28px 16px" }}>
        <h1 className="font-serif" style={{ fontSize: 36, marginBottom: 6 }}>ByOlisJo Brand Kit Lite</h1>
        <p style={{ opacity: 0.85, marginBottom: 18 }}>Describe tu marca y obtén múltiples propuestas en segundos.</p>

        <section style={{ padding: 16, borderRadius: 16, background: "#fffaf2", border: "1px solid #e4d8c6", boxShadow: "0 10px 30px rgba(0,0,0,.03)" }}>
          <label style={{ display: "block", fontSize: 14, marginBottom: 8 }}>Describe tu marca</label>
          <input
            value={prompt}
            onChange={(e)=>setPrompt(e.target.value)}
            placeholder={`ej: "moderna, femenina, elegante, beige y dorado, joyas artesanales"`}
            style={{ width: "100%", borderRadius: 12, border: "1px solid #d6c8b3", background: "#fffdfa", padding: "10px 12px" }}
          />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
            <button
              disabled={loading}
              onClick={()=>{ setNextStartSeed(0); fetchKits("replace", 6); }}
              style={{ borderRadius: 12, border: "1px solid #b08d57", background: "linear-gradient(180deg,#f9f4ec,#efe6d9)", padding: "10px 14px", cursor: "pointer" }}
            >
              {loading ? "Generando…" : "Generar 6"}
            </button>
            <button
              disabled={loading || kits.length===0}
              onClick={()=>fetchKits("append", 3)}
              style={{ borderRadius: 12, border: "1px solid #b08d57", background: "#fff", padding: "10px 14px", cursor: "pointer" }}
            >
              Agregar 3 más
            </button>
          </div>
        </section>

        {error && <p style={{ marginTop: 14, color: "#a31616" }}>{error}</p>}

        {/* Grid de resultados */}
        {kits.length > 0 && (
          <section style={{ marginTop: 20, display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {kits.map((k) => (
              <div key={k.seed} style={{ background: "#ffffff", border: "1px solid #e6dfd4", borderRadius: 16, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.2 }}>Paleta — {k.palette.name}</h3>
                  <span style={{ fontSize: 11, border: "1px solid #cbb89a", borderRadius: 999, padding: "2px 8px" }}>seed: {k.seed}</span>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  {k.palette.colors.map((c) => (
                    <div key={c} title={c} style={{ height: 34, width: 34, borderRadius: 10, border: "1px solid #d6c8b3", background: c }} />
                  ))}
                </div>
                <p style={{ marginTop: 8, fontSize: 13, opacity: .85 }}>{k.palette.colors.join(" · ")}</p>

                <div style={{ marginTop: 12 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Tipografías</div>
                  <div style={{ opacity: .9, fontSize: 14 }}>
                    Heading: <b>{k.font.heading}</b> — Body: <b>{k.font.body}</b>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Voz</div>
                  <div style={{ opacity: .9 }}>{k.voice}</div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Slogan</div>
                  <div style={{ opacity: .95 }}>{k.slogan}</div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Posts</div>
                  <ul style={{ paddingLeft: 18, margin: 0 }}>
                    {k.posts.map((p, i) => (<li key={i}><b>{p.title}:</b> {p.copy}</li>))}
                  </ul>
                </div>

                <a href={k.canvaSearch} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 12, borderRadius: 10, border: "1px solid #b08d57", padding: "8px 12px", background: "linear-gradient(180deg,#f9f4ec,#efe6d9)" }}>
                  Abrir ideas en Canva
                </a>
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}


