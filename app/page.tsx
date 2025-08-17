// app/page.tsx
"use client";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setData(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error("No se pudo generar el kit");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "Error generando kit");
    } finally { setLoading(false); }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#efe6d8", color: "#1f1b16" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
        <header style={{ marginBottom: 18 }}>
          <h1 style={{ fontSize: 36, fontWeight: 600, fontFamily: "Georgia, serif" }}>
            ByOlisJo Brand Kit Lite
          </h1>
          <p style={{ opacity: .85 }}>Describe tu marca y obtén un kit visual & de voz en segundos.</p>
        </header>

        <form onSubmit={onGenerate} style={{ background: "rgba(255,255,255,.78)", border: "1px solid #e4d8c6", borderRadius: 16, padding: 16 }}>
          <label style={{ display: "block", fontSize: 14, marginBottom: 8 }}>Describe tu marca</label>
          <input
            value={prompt}
            onChange={e=>setPrompt(e.target.value)}
            placeholder={`ej: "moderna, femenina, elegante, beige y dorado, joyas artesanales"`}
            style={{ width: "100%", border: "1px solid #d6c8b3", borderRadius: 12, padding: "10px 12px", background: "#fffdfa" }}
          />
          <button disabled={loading} style={{ marginTop: 12, border: "1px solid #b08d57", borderRadius: 12, padding: "10px 14px", background: "linear-gradient(180deg,#f9f4ec,#efe6d9)", cursor: "pointer" }}>
            {loading ? "Generando…" : "Generar Kit"}
          </button>
        </form>

        {error && <p style={{ marginTop: 14, color: "#9b1c1c" }}>{error}</p>}

        {data && (
          <section style={{ marginTop: 20, display: "grid", gap: 16, gridTemplateColumns: "1fr" }}>
            {/* Paleta */}
            <div style={{ background: "#fff", border: "1px solid #e4d8c6", borderRadius: 16, padding: 16 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600 }}>Paleta — {data.palette.name}</h2>
              <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                {data.palette.colors.map((c:string)=>(
                  <div key={c} title={c} style={{ height: 48, width: 48, borderRadius: 10, border: "1px solid #d6c8b3", background: c }} />
                ))}
              </div>
              <p style={{ marginTop: 6, fontSize: 13, opacity: .8 }}>{data.palette.colors.join(" · ")}</p>
            </div>

            {/* Fuentes */}
            <div style={{ background: "#fff", border: "1px solid #e4d8c6", borderRadius: 16, padding: 16 }}>
              <h3 style={{ fontWeight: 600 }}>Tipografías</h3>
              <p style={{ opacity: .85 }}>Heading: <b>{data.font.heading}</b> — Body: <b>{data.font.body}</b></p>
            </div>

            {/* Voz */}
            <div style={{ background: "#fff", border: "1px solid #e4d8c6", borderRadius: 16, padding: 16 }}>
              <h3 style={{ fontWeight: 600 }}>Voz de marca</h3>
              <p style={{ opacity: .9 }}>{data.voice}</p>
            </div>

            {/* Slogan */}
            <div style={{ background: "#fff", border: "1px solid #e4d8c6", borderRadius: 16, padding: 16 }}>
              <h3 style={{ fontWeight: 600 }}>Slogan propuesto</h3>
              <p style={{ opacity: .9 }}>{data.slogan}</p>
            </div>

            {/* Posts */}
            <div style={{ background: "#fff", border: "1px solid #e4d8c6", borderRadius: 16, padding: 16 }}>
              <h3 style={{ fontWeight: 600 }}>3 posts de arranque</h3>
              <ul style={{ marginTop: 6, paddingLeft: 20 }}>
                {data.posts.map((p:any, i:number)=>(
                  <li key={i}><b>{p.title}:</b> {p.copy}</li>
                ))}
              </ul>
            </div>

            <a href={data.canvaSearch} target="_blank" style={{ display: "inline-block", border: "1px solid #b08d57", borderRadius: 12, padding: "10px 14px", textDecoration: "none", color: "#1f1b16", background: "#fffaf2" }}>
              Abrir ideas relacionadas en Canva
            </a>

            <p style={{ opacity: .75, fontSize: 13 }}>{data.tip}</p>
          </section>
        )}
      </div>
    </main>
  );
}
