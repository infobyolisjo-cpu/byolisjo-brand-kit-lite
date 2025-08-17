// app/page.tsx
"use client";
import { useState } from "react";

type Proposal = {
  style?: string;
  palette: { name: string; colors: string[] };
  font: { heading: string; body: string };
  voice: string;
  slogan: string;
  posts: { title: string; copy: string }[];
  canvaSearch: string;
  tip: string;
};

function isProposal(x: any): x is Proposal {
  return x
    && x.palette && x.palette.name && Array.isArray(x.palette.colors)
    && x.font && typeof x.font.heading === "string" && typeof x.font.body === "string"
    && typeof x.voice === "string"
    && typeof x.slogan === "string"
    && Array.isArray(x.posts);
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [items, setItems] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function fetchKits(n: number, mode: "replace" | "append") {
    if (!prompt.trim()) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/generate?n=" + n, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error("No se pudo generar");

      const data = await res.json();
      const raw: any[] = Array.isArray(data) ? data : [data];
      const list: Proposal[] = raw.filter(isProposal);

      if (list.length === 0) {
        setErr("No se pudo generar");
        if (mode === "replace") setItems([]);
        return;
      }

      setItems((prev) => (mode === "replace" ? list : [...prev, ...list]));

      if (mode === "replace") {
        setTimeout(() => {
          const el = document.getElementById("results");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
      }
    } catch (e: any) {
      setErr(e?.message || "Error generando");
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    setItems([]);
    setErr(null);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#efe6d8", color: "#201810" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 16px" }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 4 }}>
          ByOlisJo Brand Kit Lite
        </h1>
        <p style={{ opacity: 0.85, marginBottom: 16 }}>
          Escribe la descripción de tu marca y genera propuestas (paleta, tipografías, voz, slogan y posts).
          <br />
          <span style={{ fontSize: 14, opacity: 0.8 }}>
            <b>Generar kit</b> crea 1 propuesta. <b>Agregar 3 más</b> añade variaciones a la lista.
          </span>
        </p>

        {/* Formulario */}
        <section
          style={{
            background: "#f6efe4",
            border: "1px solid #e6dfd4",
            padding: 16,
            borderRadius: 14,
          }}
        >
          <label style={{ fontSize: 14 }}>Describe tu marca</label>
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='Ej.: "moderna, femenina, dorado, joyas artesanales"'
            style={{
              width: "100%",
              marginTop: 6,
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #d6c8b3",
              background: "#fffdfa",
            }}
          />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
            <button
              onClick={() => fetchKits(1, "replace")}
              disabled={loading || !prompt.trim()}
              style={{
                border: "1px solid #b08d57",
                background: "linear-gradient(180deg,#f9f4ec,#efe6d9)",
                borderRadius: 12,
                padding: "10px 14px",
                cursor: loading || !prompt.trim() ? "not-allowed" : "pointer",
              }}
              title="Genera 1 propuesta a partir de tu descripción"
            >
              {loading ? "Generando…" : "Generar kit"}
            </button>

            <button
              onClick={() => fetchKits(3, "append")}
              disabled={loading || !prompt.trim()}
              style={{
                border: "1px solid #b08d57",
                background: "linear-gradient(180deg,#f9f4ec,#efe6d9)",
                borderRadius: 12,
                padding: "10px 14px",
                cursor: loading || !prompt.trim() ? "not-allowed" : "pointer",
              }}
              title="Añade 3 variaciones nuevas"
            >
              {loading ? "…" : "Agregar 3 más"}
            </button>

            <button
              onClick={clearAll}
              disabled={loading || items.length === 0}
              style={{
                border: "1px solid #cbb89a",
                background: "#ffffff",
                borderRadius: 12,
                padding: "10px 14px",
                cursor: loading || items.length === 0 ? "not-allowed" : "pointer",
              }}
              title="Limpia la lista de resultados"
            >
              Limpiar
            </button>
          </div>

          {err && (
            <p style={{ marginTop: 10, color: "#8b2d2d" }}>
              {err}
            </p>
          )}
        </section>

        {/* Resultados */}
        <section id="results" style={{ marginTop: 18, display: "grid", gap: 16 }}>
          {items.map((data, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #e4d8c6",
                borderRadius: 16,
                background: "#fffefa",
                padding: 16,
                boxShadow: "0 10px 30px rgba(0,0,0,.03)",
              }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
                Paleta — {data.palette.name}
                {data.style ? (
                  <span style={{ opacity: 0.6, fontWeight: 400 }}> | Estilo: {data.style}</span>
                ) : null}
              </h2>

              <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                {data.palette.colors.map((c) => (
                  <div
                    key={c}
                    title={c}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      border: "1px solid #e6dfd4",
                      background: c,
                    }}
                  />
                ))}
              </div>
              <p style={{ marginTop: 6, fontSize: 13, opacity: 0.8 }}>
                {data.palette.colors.join(" · ")}
              </p>

              <div style={{ marginTop: 12 }}>
                <h3 style={{ fontWeight: 600 }}>Tipografías</h3>
                <p style={{ opacity: 0.85, fontSize: 14 }}>
                  Heading: <b>{data.font.heading}</b> — Body: <b>{data.font.body}</b>
                </p>
              </div>

              <div style={{ marginTop: 12 }}>
                <h3 style={{ fontWeight: 600 }}>Voz de marca</h3>
                <p style={{ opacity: 0.9 }}>{data.voice}</p>
              </div>

              <div style={{ marginTop: 12 }}>
                <h3 style={{ fontWeight: 600 }}>Slogan propuesto</h3>
                <p style={{ opacity: 0.95 }}>✨ {data.slogan}</p>
              </div>

              <div style={{ marginTop: 12 }}>
                <h3 style={{ fontWeight: 600 }}>3 posts de arranque</h3>
                <ul style={{ paddingLeft: 18, opacity: 0.95 }}>
                  {data.posts.map((p, idx) => (
                    <li key={idx}>
                      <b>{p.title}:</b> {p.copy}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={data.canvaSearch}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: 12,
                  border: "1px solid #b08d57",
                  padding: "10px 14px",
                  borderRadius: 12,
                  textDecoration: "none",
                  color: "inherit",
                  background: "linear-gradient(180deg,#f9f4ec,#efe6d9)",
                }}
              >
                Abrir ideas relacionadas en Canva
              </a>

              <p style={{ opacity: 0.7, fontSize: 12, marginTop: 8 }}>{data.tip}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
