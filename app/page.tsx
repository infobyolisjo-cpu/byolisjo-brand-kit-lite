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

function hexToLabel(hex: string) {
  return hex.toUpperCase();
}

function isLightColor(hex: string) {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 0.299 + g * 0.587 + b * 0.114) > 160;
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
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>

      {/* ── Header ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(245,239,230,0.88)",
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
        borderBottom: "1px solid rgba(155,110,47,0.12)",
      }}>
        <div style={{
          maxWidth: "var(--max-w)", margin: "0 auto",
          padding: "0 var(--px)", height: 56,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{
            fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em",
            color: "var(--text-primary)",
          }}>
            ByOlisJo
            <span style={{ color: "var(--accent)", marginLeft: 4 }}>Brand Kit</span>
          </span>
          <span style={{
            fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "var(--accent)",
            border: "1px solid rgba(155,110,47,0.3)",
            borderRadius: 999, padding: "3px 10px",
            background: "rgba(155,110,47,0.07)",
          }}>
            Lite
          </span>
        </div>
      </header>

      <div style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "40px var(--px) 80px" }}>

        {/* ── Hero ── */}
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.25rem)",
            fontWeight: 800, lineHeight: 1.1,
            letterSpacing: "-0.035em",
            color: "var(--text-primary)",
            marginBottom: 12,
          }}>
            Tu marca,{" "}
            <span style={{
              background: "linear-gradient(135deg, #C8920A 0%, var(--accent) 55%, #6B4518 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              en segundos.
            </span>
          </h1>
          <p style={{
            fontSize: 16, color: "var(--text-secondary)",
            lineHeight: 1.75, maxWidth: 480, margin: "0 auto",
          }}>
            Describe tu marca y genera paleta, tipografías, voz, slogan y posts de arranque.
          </p>
        </div>

        {/* ── Form ── */}
        <section style={{
          background: "var(--bg-surface)",
          border: "var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: "clamp(20px, 4vw, 32px)",
          boxShadow: "var(--shadow-lg)",
          marginBottom: 40,
          position: "relative", overflow: "hidden",
        }}>
          {/* accent top bar */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: "linear-gradient(90deg, var(--accent) 0%, rgba(155,110,47,0.3) 100%)",
          }} />

          <label style={{
            display: "block", fontSize: 13, fontWeight: 600,
            color: "var(--text-primary)", letterSpacing: "0.01em", marginBottom: 8,
          }}>
            Describe tu marca
          </label>
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchKits(1, "replace")}
            placeholder='Ej.: "moderna, femenina, dorado, joyas artesanales"'
            style={{
              width: "100%", marginBottom: 16,
              padding: "13px 16px",
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(155,110,47,0.25)",
              background: "var(--bg-muted)",
              fontSize: 15, color: "var(--text-primary)",
              outline: "none", fontFamily: "var(--font-sans)",
              transition: "border-color 0.18s, box-shadow 0.18s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--accent)";
              e.target.style.boxShadow = "0 0 0 3px rgba(155,110,47,0.14)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(155,110,47,0.25)";
              e.target.style.boxShadow = "none";
            }}
          />

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button
              onClick={() => fetchKits(1, "replace")}
              disabled={loading || !prompt.trim()}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: loading || !prompt.trim()
                  ? "#C8B89A"
                  : "linear-gradient(135deg, #1A1208 0%, #2E1F0E 100%)",
                color: "#FAF6F0",
                border: "none",
                borderRadius: "var(--radius-sm)",
                padding: "11px 22px",
                fontSize: 14, fontWeight: 600, letterSpacing: "0.01em",
                cursor: loading || !prompt.trim() ? "not-allowed" : "pointer",
                boxShadow: loading || !prompt.trim() ? "none" : "0 1px 3px rgba(0,0,0,0.25), 0 4px 14px rgba(0,0,0,0.18)",
                transition: "background 0.2s, box-shadow 0.2s, transform 0.1s",
                fontFamily: "var(--font-sans)",
              }}
              onMouseEnter={(e) => {
                if (!loading && prompt.trim()) {
                  (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 1px 3px rgba(155,110,47,0.3), 0 6px 18px rgba(155,110,47,0.28)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && prompt.trim()) {
                  (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #1A1208 0%, #2E1F0E 100%)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.25), 0 4px 14px rgba(0,0,0,0.18)";
                }
              }}
              title="Genera 1 propuesta a partir de tu descripción"
            >
              {loading ? (
                <>
                  <span style={{
                    width: 14, height: 14, border: "2px solid rgba(250,246,240,0.3)",
                    borderTopColor: "#FAF6F0", borderRadius: "50%",
                    display: "inline-block", animation: "spin 0.7s linear infinite",
                  }} />
                  Generando…
                </>
              ) : (
                <>Generar kit</>
              )}
            </button>

            <button
              onClick={() => fetchKits(3, "append")}
              disabled={loading || !prompt.trim()}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "transparent",
                color: loading || !prompt.trim() ? "var(--text-muted)" : "var(--accent)",
                border: `1px solid ${loading || !prompt.trim() ? "rgba(155,110,47,0.2)" : "rgba(155,110,47,0.4)"}`,
                borderRadius: "var(--radius-sm)",
                padding: "11px 18px",
                fontSize: 14, fontWeight: 600,
                cursor: loading || !prompt.trim() ? "not-allowed" : "pointer",
                transition: "background 0.18s, border-color 0.18s",
                fontFamily: "var(--font-sans)",
              }}
              onMouseEnter={(e) => {
                if (!loading && prompt.trim())
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--accent-light)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
              title="Añade 3 variaciones nuevas"
            >
              {loading ? "…" : "+ Agregar 3 más"}
            </button>

            {items.length > 0 && (
              <button
                onClick={clearAll}
                disabled={loading}
                style={{
                  marginLeft: "auto",
                  background: "transparent", border: "none",
                  fontSize: 13, color: "var(--text-muted)",
                  cursor: "pointer", padding: "11px 12px",
                  fontFamily: "var(--font-sans)",
                  transition: "color 0.18s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                title="Limpia la lista de resultados"
              >
                Limpiar todo
              </button>
            )}
          </div>

          {err && (
            <div style={{
              marginTop: 14, padding: "10px 14px",
              background: "rgba(139,45,45,0.07)", border: "1px solid rgba(139,45,45,0.2)",
              borderRadius: "var(--radius-sm)",
              color: "#8b2d2d", fontSize: 13,
            }}>
              {err}
            </div>
          )}
        </section>

        {/* ── Results ── */}
        <section id="results" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {items.map((data, i) => (
            <KitCard key={i} data={data} index={i} />
          ))}
        </section>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}

function KitCard({ data, index }: { data: Proposal; index: number }) {
  return (
    <div style={{
      background: "var(--bg-surface)",
      border: "var(--border)",
      borderRadius: "var(--radius-xl)",
      overflow: "hidden",
      boxShadow: "var(--shadow-lg)",
    }}>
      {/* Card header */}
      <div style={{
        padding: "20px 28px 16px",
        borderBottom: "1px solid rgba(155,110,47,0.1)",
        background: "linear-gradient(135deg, #FAF6F0 0%, #F5EFE6 100%)",
        display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
      }}>
        <div>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "var(--accent)", marginBottom: 4,
          }}>
            Propuesta {index + 1}{data.style ? ` · ${data.style}` : ""}
          </div>
          <h2 style={{
            fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em",
            color: "var(--text-primary)", lineHeight: 1.2,
          }}>
            {data.palette.name}
          </h2>
        </div>
      </div>

      <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 28 }}>

        {/* Palette */}
        <div>
          <SectionLabel>Paleta de color</SectionLabel>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
            {data.palette.colors.map((c) => (
              <div key={c} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 12,
                  background: c,
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }} title={c} />
                <span style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: "0.04em",
                  color: "var(--text-muted)", fontFamily: "monospace",
                }}>
                  {hexToLabel(c)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(155,110,47,0.1)" }} />

        {/* Typography */}
        <div>
          <SectionLabel>Tipografías</SectionLabel>
          <div style={{
            marginTop: 10, display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12,
          }}>
            <div style={{
              background: "var(--bg-muted)", borderRadius: "var(--radius-md)",
              padding: "14px 16px", border: "var(--border)",
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                Heading
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.015em" }}>
                {data.font.heading}
              </div>
            </div>
            <div style={{
              background: "var(--bg-muted)", borderRadius: "var(--radius-md)",
              padding: "14px 16px", border: "var(--border)",
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                Body
              </div>
              <div style={{ fontSize: 16, fontWeight: 400, color: "var(--text-secondary)" }}>
                {data.font.body}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(155,110,47,0.1)" }} />

        {/* Slogan */}
        <div>
          <SectionLabel>Slogan</SectionLabel>
          <div style={{
            marginTop: 10,
            background: "linear-gradient(135deg, rgba(155,110,47,0.08) 0%, rgba(155,110,47,0.04) 100%)",
            border: "1px solid rgba(155,110,47,0.2)",
            borderLeft: "3px solid var(--accent)",
            borderRadius: "0 var(--radius-md) var(--radius-md) 0",
            padding: "14px 18px",
          }}>
            <p style={{
              fontSize: 18, fontWeight: 600, letterSpacing: "-0.015em",
              color: "var(--text-primary)", lineHeight: 1.5,
              fontStyle: "italic",
            }}>
              "{data.slogan}"
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(155,110,47,0.1)" }} />

        {/* Voice */}
        <div>
          <SectionLabel>Voz de marca</SectionLabel>
          <p style={{
            marginTop: 8, fontSize: 15, lineHeight: 1.75,
            color: "var(--text-secondary)",
          }}>
            {data.voice}
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(155,110,47,0.1)" }} />

        {/* Posts */}
        <div>
          <SectionLabel>3 posts de arranque</SectionLabel>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
            {data.posts.map((p, idx) => (
              <div key={idx} style={{
                display: "grid", gridTemplateColumns: "28px 1fr", gap: 12, alignItems: "flex-start",
                background: "var(--bg-muted)", border: "var(--border)",
                borderRadius: "var(--radius-md)", padding: "12px 14px",
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "linear-gradient(135deg, #C8920A 0%, var(--accent) 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0,
                }}>
                  {idx + 1}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>
                    {p.title}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    {p.copy}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer row */}
        <div style={{
          display: "flex", flexWrap: "wrap", alignItems: "center",
          justifyContent: "space-between", gap: 12,
          paddingTop: 8,
        }}>
          <a
            href={data.canvaSearch}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #C8920A 0%, var(--accent) 55%, #6B4518 100%)",
              color: "#fff", border: "none",
              borderRadius: "var(--radius-sm)",
              padding: "10px 20px",
              fontSize: 13, fontWeight: 600, letterSpacing: "0.01em",
              boxShadow: "0 1px 3px rgba(155,110,47,0.3), 0 4px 12px rgba(155,110,47,0.22)",
              transition: "opacity 0.18s, transform 0.12s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.opacity = "0.88";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
              (e.currentTarget as HTMLAnchorElement).style.transform = "none";
            }}
          >
            Explorar en Canva
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17L17 7M7 7h10v10"/>
            </svg>
          </a>

          {data.tip && (
            <p style={{
              fontSize: 12, color: "var(--text-muted)",
              maxWidth: 320, lineHeight: 1.5, fontStyle: "italic",
            }}>
              {data.tip}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
      textTransform: "uppercase", color: "var(--accent)",
    }}>
      {children}
    </div>
  );
}
