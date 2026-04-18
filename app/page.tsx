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

/* ─── Styles helpers ─── */
const S = {
  /* Header */
  header: {
    position: "fixed" as const, top: 0, left: 0, right: 0, zIndex: 100,
    height: 56,
    background: "rgba(12,10,7,0.82)",
    backdropFilter: "saturate(160%) blur(24px)",
    WebkitBackdropFilter: "saturate(160%) blur(24px)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  headerInner: {
    maxWidth: "var(--max-w)", margin: "0 auto",
    padding: "0 var(--px)", height: 56,
    display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  logoText: {
    fontSize: 14, fontWeight: 700, letterSpacing: "-0.02em", color: "#FAF3E4",
  },
  logoDot: { color: "var(--gold-300)", marginLeft: 3 },
  pill: {
    fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const,
    color: "var(--gold-300)",
    border: "1px solid rgba(232,184,75,0.35)",
    borderRadius: 999, padding: "3px 10px",
    background: "rgba(232,184,75,0.08)",
  },

  /* Hero */
  hero: {
    position: "relative" as const, overflow: "hidden",
    background: "var(--bg-hero)",
    paddingTop: 120, paddingBottom: 80,
    display: "flex", flexDirection: "column" as const, alignItems: "center",
  },

  /* Body */
  body: {
    background: "var(--bg-base)",
    maxWidth: "var(--max-w)", margin: "0 auto",
    padding: "48px var(--px) 96px",
  },
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [items, setItems] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [inputFocused, setInputFocused] = useState(false);

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

  const canSubmit = !loading && !!prompt.trim();

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-hero)" }}>

      {/* ── Sticky nav ── */}
      <header style={S.header}>
        <div style={S.headerInner}>
          <span style={S.logoText}>
            ByOlisJo<span style={S.logoDot}>·</span>
          </span>
          <span style={S.pill}>Brand Kit</span>
        </div>
      </header>

      {/* ═══════════════════════════════════════
          HERO — dark immersive studio
      ═══════════════════════════════════════ */}
      <section style={S.hero}>

        {/* Ambient glows */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `
            radial-gradient(ellipse 80% 60% at 50% 0%,   rgba(196,138,32,0.22) 0%, transparent 65%),
            radial-gradient(ellipse 50% 35% at 15% 80%,  rgba(155,110,47,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 88% 70%,  rgba(232,184,75,0.07) 0%, transparent 55%)
          `,
        }} />

        {/* Grain */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.028,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px",
        }} />

        {/* Horizontal shimmer line */}
        <div aria-hidden="true" style={{
          position: "absolute", top: "42%", left: "50%", transform: "translateX(-50%)",
          width: "min(560px, 90vw)", height: 1,
          background: "linear-gradient(90deg, transparent 0%, rgba(232,184,75,0.25) 30%, rgba(232,184,75,0.5) 50%, rgba(232,184,75,0.25) 70%, transparent 100%)",
          pointerEvents: "none",
        }} />

        {/* Content */}
        <div style={{
          position: "relative", zIndex: 1,
          width: "100%", maxWidth: "var(--max-w)",
          padding: "0 var(--px)", textAlign: "center",
        }}>

          {/* Badge */}
          <div className="fade-up" style={{ marginBottom: 28 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "var(--gold-300)",
              border: "1px solid rgba(232,184,75,0.3)",
              borderRadius: 999, padding: "5px 14px",
              background: "rgba(232,184,75,0.07)",
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: "50%",
                background: "var(--gold-300)", flexShrink: 0,
              }} />
              Generador de identidad de marca
            </span>
          </div>

          {/* Title */}
          <h1 className="fade-up fade-up-d1" style={{
            fontSize: "clamp(2.5rem, 6.5vw, 4.75rem)",
            fontWeight: 800, lineHeight: 1.06,
            letterSpacing: "-0.04em",
            color: "#FAF3E4",
            marginBottom: 20,
          }}>
            Tu identidad de marca,{" "}
            <br />
            <span style={{
              background: "linear-gradient(135deg, #F5D080 0%, var(--gold-300) 40%, var(--gold-500) 75%, #A67828 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              en segundos.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="fade-up fade-up-d2" style={{
            fontSize: "clamp(15px, 2vw, 17px)",
            color: "rgba(250,243,228,0.58)",
            lineHeight: 1.75, maxWidth: 460,
            margin: "0 auto 44px",
            letterSpacing: "-0.01em",
          }}>
            Describe tu marca y genera paleta, tipografías, voz, slogan y posts de arranque listos para usar.
          </p>

          {/* ── Form box on dark ── */}
          <div className="fade-up fade-up-d3" style={{
            maxWidth: 580, margin: "0 auto",
          }}>
            {/* Input */}
            <div style={{
              position: "relative",
              marginBottom: 12,
            }}>
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchKits(1, "replace")}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder="Describe tu marca: estilo, colores, sensación…"
                style={{
                  width: "100%",
                  padding: "18px 22px",
                  borderRadius: 14,
                  border: inputFocused
                    ? "1px solid rgba(232,184,75,0.65)"
                    : "1px solid rgba(255,255,255,0.1)",
                  background: inputFocused
                    ? "rgba(255,255,255,0.07)"
                    : "rgba(255,255,255,0.05)",
                  fontSize: 15,
                  color: "#FAF3E4",
                  outline: "none",
                  fontFamily: "var(--font-sans)",
                  letterSpacing: "-0.01em",
                  transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
                  boxShadow: inputFocused
                    ? "0 0 0 3px rgba(232,184,75,0.12), inset 0 1px 0 rgba(255,255,255,0.05)"
                    : "inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              />
            </div>

            {/* Primary CTA */}
            <button
              onClick={() => fetchKits(1, "replace")}
              disabled={!canSubmit}
              style={{
                width: "100%",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                padding: "17px 32px",
                borderRadius: 14,
                border: "none",
                background: canSubmit
                  ? "linear-gradient(135deg, #F0C14A 0%, #D4972C 40%, #A16E22 100%)"
                  : "rgba(255,255,255,0.08)",
                color: canSubmit ? "#1A0E00" : "rgba(255,255,255,0.25)",
                fontSize: 15, fontWeight: 700, letterSpacing: "0.01em",
                cursor: canSubmit ? "pointer" : "not-allowed",
                boxShadow: canSubmit ? "var(--shadow-glow)" : "none",
                transition: "background 0.2s, box-shadow 0.2s, transform 0.12s, opacity 0.2s",
                fontFamily: "var(--font-sans)",
              }}
              onMouseEnter={(e) => {
                if (canSubmit) {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0 1px rgba(196,138,32,0.5), 0 12px 40px rgba(155,110,47,0.6)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = canSubmit ? "var(--shadow-glow)" : "none";
              }}
              title="Genera 1 propuesta a partir de tu descripción"
            >
              {loading ? (
                <>
                  <span style={{
                    width: 16, height: 16,
                    border: "2px solid rgba(26,14,0,0.25)",
                    borderTopColor: "#1A0E00",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.7s linear infinite",
                  }} />
                  Generando tu kit…
                </>
              ) : (
                <>
                  Generar kit de marca
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>

            {/* Secondary row */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
              marginTop: 14, flexWrap: "wrap",
            }}>
              <button
                onClick={() => fetchKits(3, "append")}
                disabled={!canSubmit}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "transparent",
                  color: canSubmit ? "rgba(232,184,75,0.8)" : "rgba(255,255,255,0.2)",
                  border: `1px solid ${canSubmit ? "rgba(232,184,75,0.3)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 10, padding: "10px 18px",
                  fontSize: 13, fontWeight: 600,
                  cursor: canSubmit ? "pointer" : "not-allowed",
                  transition: "background 0.18s, border-color 0.18s",
                  fontFamily: "var(--font-sans)",
                }}
                onMouseEnter={(e) => {
                  if (canSubmit) (e.currentTarget as HTMLButtonElement).style.background = "rgba(232,184,75,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
                title="Añade 3 variaciones nuevas"
              >
                + Agregar 3 variaciones más
              </button>

              {items.length > 0 && (
                <button
                  onClick={clearAll}
                  disabled={loading}
                  style={{
                    background: "transparent", border: "none",
                    fontSize: 12, color: "rgba(255,255,255,0.28)",
                    cursor: "pointer", padding: "10px 8px",
                    fontFamily: "var(--font-sans)",
                    transition: "color 0.18s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.55)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.28)")}
                  title="Limpia la lista de resultados"
                >
                  Limpiar todo
                </button>
              )}
            </div>

            {/* Micro trust */}
            <p style={{
              marginTop: 20, fontSize: 11,
              color: "rgba(250,243,228,0.28)",
              letterSpacing: "0.04em",
            }}>
              Sin registro · Sin tarjeta · Resultado en segundos
            </p>

            {/* Error */}
            {err && (
              <div style={{
                marginTop: 14, padding: "11px 16px",
                background: "rgba(180,50,50,0.12)",
                border: "1px solid rgba(180,50,50,0.25)",
                borderRadius: 10, color: "#F87171", fontSize: 13,
                textAlign: "left",
              }}>
                {err}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          RESULTS — light surface
      ═══════════════════════════════════════ */}
      {items.length > 0 && (
        <section
          id="results"
          style={{
            background: "var(--bg-base)",
            borderTop: "1px solid rgba(155,110,47,0.15)",
          }}
        >
          <div style={S.body}>
            <div style={{
              marginBottom: 32, display: "flex",
              alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
            }}>
              <div>
                <p style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                  textTransform: "uppercase", color: "var(--gold-700)", marginBottom: 4,
                }}>
                  Resultados generados
                </p>
                <h2 style={{
                  fontSize: 22, fontWeight: 700,
                  letterSpacing: "-0.025em", color: "var(--text-primary)",
                }}>
                  {items.length} propuesta{items.length !== 1 ? "s" : ""} de marca
                </h2>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {items.map((data, i) => (
                <KitCard key={i} data={data} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}

/* ─────────────────────────────────────────
   KIT CARD
───────────────────────────────────────── */
function KitCard({ data, index }: { data: Proposal; index: number }) {
  return (
    <article style={{
      background: "var(--bg-surface)",
      border: "1px solid rgba(155,110,47,0.14)",
      borderRadius: 20,
      overflow: "hidden",
      boxShadow: "var(--shadow-lg)",
    }}>

      {/* Card header */}
      <div style={{
        padding: "22px 28px 18px",
        background: "linear-gradient(135deg, #FAF6F0 0%, #F3EBE0 100%)",
        borderBottom: "1px solid rgba(155,110,47,0.1)",
        display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", flexWrap: "wrap", gap: 8,
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative corner glow */}
        <div aria-hidden="true" style={{
          position: "absolute", top: -30, right: -30,
          width: 120, height: 120, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(196,138,32,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative" }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "var(--gold-700)", marginBottom: 5,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 18, height: 18, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--gold-300), var(--gold-700))",
              fontSize: 9, fontWeight: 800, color: "#1A0E00",
            }}>
              {index + 1}
            </span>
            Propuesta{data.style ? ` · ${data.style}` : ""}
          </div>
          <h2 style={{
            fontSize: 22, fontWeight: 700, letterSpacing: "-0.025em",
            color: "var(--text-primary)", lineHeight: 1.2,
          }}>
            {data.palette.name}
          </h2>
        </div>
      </div>

      <div style={{ padding: "28px 28px", display: "flex", flexDirection: "column", gap: 28 }}>

        {/* ── Palette ── */}
        <div>
          <Label>Paleta de color</Label>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
            {data.palette.colors.map((c) => (
              <div key={c} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
                <div style={{
                  width: 60, height: 60, borderRadius: 14,
                  background: c,
                  border: "1px solid rgba(0,0,0,0.09)",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)",
                }} title={c} />
                <span style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: "0.05em",
                  color: "var(--text-muted)", fontFamily: "ui-monospace, monospace",
                }}>
                  {c.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ── Typography ── */}
        <div>
          <Label>Tipografías</Label>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12, marginTop: 12,
          }}>
            <TypeCard label="Heading" value={data.font.heading} large />
            <TypeCard label="Body" value={data.font.body} large={false} />
          </div>
        </div>

        <Divider />

        {/* ── Slogan ── */}
        <div>
          <Label>Slogan</Label>
          <div style={{
            marginTop: 12,
            padding: "18px 22px",
            background: "linear-gradient(135deg, rgba(196,138,32,0.07) 0%, rgba(155,110,47,0.04) 100%)",
            border: "1px solid rgba(196,138,32,0.2)",
            borderLeft: "4px solid var(--gold-500)",
            borderRadius: "0 12px 12px 0",
          }}>
            <p style={{
              fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em",
              color: "var(--text-primary)", lineHeight: 1.45, fontStyle: "italic",
            }}>
              "{data.slogan}"
            </p>
          </div>
        </div>

        <Divider />

        {/* ── Voice ── */}
        <div>
          <Label>Voz de marca</Label>
          <p style={{
            marginTop: 10, fontSize: 15, lineHeight: 1.8,
            color: "var(--text-secondary)", letterSpacing: "-0.005em",
          }}>
            {data.voice}
          </p>
        </div>

        <Divider />

        {/* ── Posts ── */}
        <div>
          <Label>3 posts de arranque</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
            {data.posts.map((p, idx) => (
              <div key={idx} style={{
                display: "grid", gridTemplateColumns: "36px 1fr", gap: 14,
                background: "var(--bg-muted)",
                border: "1px solid rgba(155,110,47,0.12)",
                borderRadius: 12, padding: "14px 16px",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(135deg, var(--gold-300) 0%, var(--gold-700) 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 800, color: "#1A0E00",
                }}>
                  {idx + 1}
                </div>
                <div>
                  <div style={{
                    fontSize: 13, fontWeight: 700, color: "var(--text-primary)",
                    marginBottom: 3, letterSpacing: "-0.01em",
                  }}>
                    {p.title}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>
                    {p.copy}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{
          display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "space-between",
          gap: 14, paddingTop: 4,
        }}>
          <a
            href={data.canvaSearch}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              background: "linear-gradient(135deg, #F0C14A 0%, #D4972C 45%, #A16E22 100%)",
              color: "#1A0E00", border: "none",
              borderRadius: 10, padding: "12px 22px",
              fontSize: 13, fontWeight: 700, letterSpacing: "0.01em",
              boxShadow: "0 1px 3px rgba(155,110,47,0.3), 0 4px 16px rgba(155,110,47,0.25)",
              transition: "opacity 0.18s, transform 0.12s, box-shadow 0.18s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = "translateY(-2px)";
              el.style.boxShadow = "0 1px 3px rgba(155,110,47,0.4), 0 8px 24px rgba(155,110,47,0.4)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = "";
              el.style.boxShadow = "0 1px 3px rgba(155,110,47,0.3), 0 4px 16px rgba(155,110,47,0.25)";
            }}
          >
            Explorar en Canva
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17L17 7M7 7h10v10"/>
            </svg>
          </a>

          {data.tip && (
            <p style={{
              fontSize: 12, color: "var(--text-muted)", maxWidth: 340,
              lineHeight: 1.6, fontStyle: "italic",
            }}>
              {data.tip}
            </p>
          )}
        </div>

      </div>
    </article>
  );
}

/* ─── Shared sub-components ─── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
      textTransform: "uppercase", color: "var(--gold-700)",
    }}>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "rgba(155,110,47,0.1)" }} />;
}

function TypeCard({ label, value, large }: { label: string; value: string; large: boolean }) {
  return (
    <div style={{
      background: "var(--bg-muted)",
      borderRadius: 12,
      padding: "14px 16px",
      border: "1px solid rgba(155,110,47,0.1)",
    }}>
      <div style={{
        fontSize: 10, fontWeight: 700, color: "var(--text-muted)",
        textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: large ? 20 : 16,
        fontWeight: large ? 700 : 400,
        color: "var(--text-primary)",
        letterSpacing: large ? "-0.02em" : "-0.01em",
        lineHeight: 1.3,
      }}>
        {value}
      </div>
    </div>
  );
}
