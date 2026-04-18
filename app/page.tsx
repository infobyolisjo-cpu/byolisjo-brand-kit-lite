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
  const [focused, setFocused] = useState(false);

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
          document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
      }
    } catch (e: any) {
      setErr(e?.message || "Error generando");
    } finally {
      setLoading(false);
    }
  }

  function clearAll() { setItems([]); setErr(null); }

  const can = !loading && !!prompt.trim();

  return (
    <main>

      {/* ═══ NAV ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: 52,
        background: "rgba(12,10,7,0.78)",
        backdropFilter: "saturate(160%) blur(28px)",
        WebkitBackdropFilter: "saturate(160%) blur(28px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{
          maxWidth: "var(--max-w)", margin: "0 auto", padding: "0 var(--px)",
          height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "-0.01em", color: "#FAF3E4" }}>
              ByOlisJo
            </span>
            <span style={{
              width: 1, height: 12,
              background: "rgba(255,255,255,0.15)",
            }} />
            <span style={{
              fontSize: 11, fontWeight: 500, letterSpacing: "0.06em",
              color: "rgba(232,184,75,0.7)", textTransform: "uppercase",
            }}>
              Brand Kit
            </span>
          </div>

          {/* Trust stat */}
          <span style={{
            fontSize: 11, fontWeight: 500,
            color: "rgba(250,243,228,0.35)",
            letterSpacing: "0.02em",
          }}>
            500+ identidades creadas
          </span>
        </div>
      </nav>

      {/* ═══ HERO — editorial 2-col ═══ */}
      <section style={{
        position: "relative",
        background: "var(--bg-hero)",
        paddingTop: 120, paddingBottom: 96,
        overflow: "hidden",
      }}>

        {/* Single focused glow — LEFT side, not centered */}
        <div aria-hidden="true" style={{
          position: "absolute", top: "-20%", left: "-8%",
          width: "55vw", height: "80vh",
          background: "radial-gradient(ellipse at center, rgba(180,120,28,0.16) 0%, transparent 68%)",
          pointerEvents: "none",
        }} />

        {/* Grain */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px",
        }} />

        {/* ── 2-column editorial grid ── */}
        <div className="hero-grid">

          {/* LEFT — editorial headline */}
          <div>

            {/* Eyebrow — editorial label */}
            <div className="fade-up" style={{ marginBottom: 28 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(232,184,75,0.55)",
              }}>
                Identidad visual · ByOlisJo
              </span>
              {/* Thin accent rule */}
              <div style={{
                marginTop: 10, height: 1, width: 40,
                background: "linear-gradient(90deg, rgba(232,184,75,0.6), transparent)",
              }} />
            </div>

            {/* H1 — split typographic treatment */}
            <h1 className="fade-up d1" style={{
              fontSize: "clamp(2.75rem, 5.5vw, 4.5rem)",
              fontWeight: 800,
              lineHeight: 1.06,
              letterSpacing: "-0.04em",
              color: "#FAF3E4",
              marginBottom: 28,
            }}>
              Tu marca{" "}
              <br />
              no debería{" "}
              <br />
              <em style={{
                fontStyle: "italic",
                background: "linear-gradient(135deg, #F5D080 0%, var(--gold-300) 45%, var(--gold-500) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                parecer prestada.
              </em>
            </h1>

            {/* Manifesto line */}
            <div className="fade-up d2" style={{
              display: "flex", alignItems: "flex-start", gap: 12,
            }}>
              <div style={{
                width: 2, flexShrink: 0, alignSelf: "stretch",
                background: "linear-gradient(180deg, rgba(232,184,75,0.5), transparent)",
                borderRadius: 1, minHeight: 36,
              }} />
              <p style={{
                fontSize: 14, lineHeight: 1.7,
                color: "rgba(250,243,228,0.45)",
                letterSpacing: "-0.005em",
                fontStyle: "italic",
              }}>
                "Construimos identidades con propósito,<br />
                no plantillas con color."
              </p>
            </div>

          </div>

          {/* RIGHT — form */}
          <div className="fade-up d3">

            {/* Form container — amber top-border signature */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(232,184,75,0.13)",
              borderTop: "2px solid rgba(232,184,75,0.5)",
              borderRadius: 14,
              padding: "22px 20px 20px",
              marginBottom: 12,
            }}>

            {/* Form label — ByOlisJo voice, reacts to focus */}
            <p style={{
              fontSize: 13, fontWeight: 600,
              color: focused ? "rgba(232,184,75,0.85)" : "rgba(250,243,228,0.55)",
              marginBottom: 14, lineHeight: 1.5,
              letterSpacing: "-0.01em",
              transition: "color 0.22s",
            }}>
              ¿Cómo describirías tu marca<br />si la presentaras en persona?
            </p>

            {/* Input */}
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={'Directa. Femenina. Dorada.\nQue vende con autoridad.'}
              style={{
                width: "100%",
                padding: "16px 18px",
                borderRadius: 12,
                border: focused
                  ? "1px solid rgba(232,184,75,0.6)"
                  : "1px solid rgba(255,255,255,0.09)",
                background: focused
                  ? "rgba(255,255,255,0.07)"
                  : "rgba(255,255,255,0.04)",
                fontSize: 14,
                color: "#FAF3E4",
                outline: "none",
                fontFamily: "var(--font-sans)",
                lineHeight: 1.65,
                letterSpacing: "-0.01em",
                resize: "none",
                transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
                boxShadow: focused
                  ? "0 0 0 3px rgba(232,184,75,0.1)"
                  : "none",
              }}
            />

            {/* Primary CTA */}
            <button
              onClick={() => fetchKits(1, "replace")}
              disabled={!can}
              className={can ? "cta-btn cta-glow" : "cta-btn"}
              style={{
                width: "100%",
                marginTop: 10,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "18px 24px",
                borderRadius: 12,
                border: "none",
                background: can
                  ? "linear-gradient(135deg, #EFC143 0%, #C98A1A 50%, #9B6E2F 100%)"
                  : "rgba(255,255,255,0.06)",
                color: can ? "#1A0E00" : "rgba(255,255,255,0.2)",
                fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em",
                cursor: can ? "pointer" : "not-allowed",
                boxShadow: can ? undefined : "none",
                transition: "background 0.2s, transform 0.14s",
                fontFamily: "var(--font-sans)",
              }}
              onMouseEnter={(e) => {
                if (can) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "";
              }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 auto" }}>
                  <span style={{
                    width: 15, height: 15,
                    border: "2px solid rgba(26,14,0,0.2)",
                    borderTopColor: "#1A0E00", borderRadius: "50%",
                    display: "inline-block", animation: "spin 0.7s linear infinite",
                  }} />
                  Construyendo tu identidad…
                </span>
              ) : (
                <>
                  <span>Crear mi identidad visual</span>
                  <svg className="cta-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>

            {/* close form container */}
            </div>

            {/* Secondary row */}
            <div style={{
              marginTop: 12,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: 8,
            }}>
              <button
                onClick={() => fetchKits(3, "append")}
                disabled={!can}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: "6px 0",
                  fontSize: 12, fontWeight: 600,
                  color: can ? "rgba(232,184,75,0.6)" : "rgba(255,255,255,0.18)",
                  cursor: can ? "pointer" : "not-allowed",
                  fontFamily: "var(--font-sans)",
                  letterSpacing: "0.01em",
                  transition: "color 0.18s",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                  textDecorationColor: "rgba(232,184,75,0.25)",
                }}
                onMouseEnter={(e) => {
                  if (can) (e.currentTarget as HTMLButtonElement).style.color = "rgba(232,184,75,0.9)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = can
                    ? "rgba(232,184,75,0.6)"
                    : "rgba(255,255,255,0.18)";
                }}
              >
                + Agregar 3 variaciones
              </button>

              {items.length > 0 && (
                <button
                  onClick={clearAll}
                  disabled={loading}
                  style={{
                    background: "transparent", border: "none",
                    fontSize: 11, color: "rgba(255,255,255,0.22)",
                    cursor: "pointer", padding: "6px 0",
                    fontFamily: "var(--font-sans)",
                    letterSpacing: "0.02em",
                    transition: "color 0.18s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.45)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.22)")}
                >
                  Limpiar todo
                </button>
              )}
            </div>

            {err && (
              <div style={{
                marginTop: 12, padding: "10px 14px",
                background: "rgba(180,50,50,0.1)",
                border: "1px solid rgba(180,50,50,0.2)",
                borderRadius: 8, color: "#F87171", fontSize: 12,
              }}>
                {err}
              </div>
            )}

            {/* Micro trust */}
            <p style={{
              marginTop: 18, fontSize: 10,
              color: "rgba(250,243,228,0.22)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}>
              Sin registro · Sin tarjeta · Resultado en segundos
            </p>

          </div>
        </div>
      </section>

      {/* ═══ RESULTS ═══ */}
      {items.length > 0 && (
        <section id="results" style={{
          background: "var(--bg-base)",
          borderTop: "1px solid rgba(155,110,47,0.12)",
        }}>
          <div className="results-body">

            {/* Results header */}
            <div style={{ marginBottom: 36 }}>
              <p style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.15em",
                textTransform: "uppercase", color: "var(--gold-700)", marginBottom: 6,
              }}>
                Identidades generadas
              </p>
              <h2 style={{
                fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em",
                color: "var(--text-primary)",
              }}>
                {items.length} propuesta{items.length !== 1 ? "s" : ""} para tu marca
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
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
  const kit = String(index + 1).padStart(2, "0");

  return (
    <article style={{
      background: "var(--bg-surface)",
      border: "1px solid rgba(155,110,47,0.13)",
      borderRadius: 20,
      overflow: "hidden",
      boxShadow: "var(--shadow-lg)",
    }}>

      {/* Card header — editorial */}
      <div style={{
        padding: "22px 28px 20px",
        background: "linear-gradient(135deg, #FAF6F0 0%, #F0E8DC 100%)",
        borderBottom: "1px solid rgba(155,110,47,0.1)",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 5,
          }}>
            Kit N°{kit}{data.style ? ` · ${data.style}` : ""}
          </div>
          <h2 style={{
            fontSize: 21, fontWeight: 700, letterSpacing: "-0.025em",
            color: "var(--text-primary)", lineHeight: 1.2,
          }}>
            {data.palette.name}
          </h2>
        </div>

        {/* Palette preview strip */}
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          {data.palette.colors.slice(0, 5).map((c) => (
            <div key={c} style={{
              width: 20, height: 20, borderRadius: 5,
              background: c,
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }} title={c} />
          ))}
        </div>
      </div>

      <div style={{ padding: "28px 28px", display: "flex", flexDirection: "column", gap: 28 }}>

        {/* Palette — full */}
        <div>
          <Label>Paleta</Label>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
            {data.palette.colors.map((c) => (
              <div key={c} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 12,
                  background: c,
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
                }} />
                <span style={{
                  fontSize: 9, fontWeight: 600, letterSpacing: "0.05em",
                  color: "var(--text-muted)", fontFamily: "ui-monospace, monospace",
                }}>
                  {c.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Sep />

        {/* Typography */}
        <div>
          <Label>Tipografías</Label>
          <div style={{
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 10,
          }}>
            <TypeCard label="Heading" value={data.font.heading} size={20} weight={700} />
            <TypeCard label="Body" value={data.font.body} size={15} weight={400} />
          </div>
        </div>

        <Sep />

        {/* Slogan — pull quote */}
        <div>
          <Label>Slogan</Label>
          <div style={{
            marginTop: 12,
            padding: "20px 24px",
            background: "linear-gradient(135deg, rgba(196,138,32,0.06), rgba(155,110,47,0.03))",
            border: "1px solid rgba(196,138,32,0.18)",
            borderLeft: "4px solid var(--gold-500)",
            borderRadius: "0 12px 12px 0",
          }}>
            <p style={{
              fontSize: 19, fontWeight: 600, letterSpacing: "-0.02em",
              color: "var(--text-primary)", lineHeight: 1.4, fontStyle: "italic",
            }}>
              "{data.slogan}"
            </p>
          </div>
        </div>

        <Sep />

        {/* Voice */}
        <div>
          <Label>Voz de marca</Label>
          <p style={{
            marginTop: 10, fontSize: 14, lineHeight: 1.8,
            color: "var(--text-secondary)", letterSpacing: "-0.005em",
          }}>
            {data.voice}
          </p>
        </div>

        <Sep />

        {/* Posts */}
        <div>
          <Label>Posts de arranque</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            {data.posts.map((p, idx) => (
              <div key={idx} style={{
                display: "grid", gridTemplateColumns: "28px 1fr", gap: 12,
                background: "var(--bg-muted)",
                border: "1px solid rgba(155,110,47,0.1)",
                borderRadius: 10, padding: "12px 14px",
              }}>
                <span style={{
                  fontSize: 11, fontWeight: 800, color: "var(--gold-700)",
                  letterSpacing: "0.04em", alignSelf: "flex-start", paddingTop: 1,
                  fontFamily: "ui-monospace, monospace",
                }}>
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>
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

        {/* Footer */}
        <div style={{
          display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "space-between", gap: 14,
        }}>
          <a
            href={data.canvaSearch}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #EFC143 0%, #C98A1A 50%, #9B6E2F 100%)",
              color: "#1A0E00",
              borderRadius: 10, padding: "11px 20px",
              fontSize: 13, fontWeight: 700,
              boxShadow: "0 1px 3px rgba(155,110,47,0.25), 0 4px 14px rgba(155,110,47,0.2)",
              transition: "transform 0.14s, box-shadow 0.14s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = "translateY(-1px)";
              el.style.boxShadow = "0 2px 6px rgba(155,110,47,0.35), 0 8px 22px rgba(155,110,47,0.35)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = "";
              el.style.boxShadow = "0 1px 3px rgba(155,110,47,0.25), 0 4px 14px rgba(155,110,47,0.2)";
            }}
          >
            Explorar en Canva
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17L17 7M7 7h10v10"/>
            </svg>
          </a>

          {data.tip && (
            <p style={{
              fontSize: 11, color: "var(--text-muted)",
              maxWidth: 340, lineHeight: 1.6, fontStyle: "italic",
            }}>
              {data.tip}
            </p>
          )}
        </div>

      </div>
    </article>
  );
}

/* ─── Sub-components ─── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 9, fontWeight: 800, letterSpacing: "0.16em",
      textTransform: "uppercase", color: "var(--gold-700)",
    }}>
      {children}
    </div>
  );
}

function Sep() {
  return <div style={{ height: 1, background: "rgba(155,110,47,0.09)" }} />;
}

function TypeCard({ label, value, size, weight }: {
  label: string; value: string; size: number; weight: number;
}) {
  return (
    <div style={{
      background: "var(--bg-muted)", borderRadius: 10, padding: "14px 16px",
      border: "1px solid rgba(155,110,47,0.1)",
    }}>
      <div style={{
        fontSize: 9, fontWeight: 800, color: "var(--text-muted)",
        textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 7,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: size, fontWeight: weight, color: "var(--text-primary)",
        letterSpacing: "-0.015em", lineHeight: 1.25,
      }}>
        {value}
      </div>
    </div>
  );
}
