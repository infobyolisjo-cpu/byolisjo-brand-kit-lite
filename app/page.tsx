"use client";

import React, { useState } from "react";

type PreviewData = {
  name: string;
  colors: string[];
  slogans: string[];   // ahora es array
  logoSVG: string;
};

export default function Page() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [aud, setAud] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [chosen, setChosen] = useState<string>(""); // slogan elegido
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setPreview(null); setChosen("");
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, desc, aud }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to generate");
      const p = data as PreviewData;
      setPreview(p);
      setChosen(p.slogans[0] || "");
    } catch (err: any) {
      setError(err.message || "Error generating kit");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    if (!preview) return;
    setDownloading(true); setError(null);
    try {
      const res = await fetch("/api/zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: preview.name,
          slogan: chosen || preview.slogans[0] || "",
          colors: preview.colors,
        }),
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${preview.name.replace(/\s+/g, "_")}_BrandKit.zip`;
      document.body.appendChild(a);
      a.click(); a.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || "Error downloading");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <main style={{ maxWidth: 980, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 40, fontWeight: 700, marginBottom: 8 }}>ByOlisJo Brand Kit Lite</h1>
      <p style={{ color: "#6b6b6b", marginBottom: 24 }}>Premium & minimal — beige & gold aesthetic</p>

      <section style={{ background: "#faf5ef", border: "1px solid #eadfd2", borderRadius: 12, padding: 20, boxShadow: "0 6px 14px rgba(0,0,0,0.04)" }}>
        <h2 style={{ fontSize: 24, margin: "0 0 12px" }}>Your Brand Identity in Minutes</h2>
        <p style={{ margin: "0 0 16px", color: "#6b6b6b" }}>
          View your palette, choose a slogan and wordmark — download only if you like it.
        </p>

        <form onSubmit={handleGenerate} style={{ display: "grid", gap: 10 }}>
          <input placeholder="Business name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle}/>
          <input placeholder="Short description" value={desc} onChange={(e) => setDesc(e.target.value)} style={inputStyle}/>
          <input placeholder="Main target audience" value={aud} onChange={(e) => setAud(e.target.value)} style={inputStyle}/>
          <button type="submit" disabled={loading || !name || !desc || !aud} style={buttonStyle}>
            {loading ? "Generating…" : "Generate My Brand Kit"}
          </button>
        </form>

        {error && <div style={{ marginTop: 12, color: "#b42318" }}>{error}</div>}
      </section>

      {preview && (
        <section style={{ marginTop: 28 }}>
          <h3 style={{ fontSize: 22, marginBottom: 12 }}>Preview</h3>

          <div className="previewGrid">
            {/* Columna izquierda: Paleta */}
            <div className="previewCard">
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Palette</div>
              <div className="swatchRow">
                {preview.colors.map((c) => (
                  <div
                    key={c}
                    title={c}
                    style={{
                      width: 88,
                      height: 88,
                      borderRadius: 12,
                      border: "1px solid #e5e5e5",
                      background: c,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Columna derecha: Slogans */}
            <div className="previewCard">
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Choose your slogan</div>
              <div style={{ display: "grid", gap: 12 }}>
                {preview.slogans.map((s, i) => (
                  <label key={i} className="sloganCard">
                    <input
                      type="radio"
                      name="slogan"
                      checked={chosen === s}
                      onChange={() => setChosen(s)}
                      style={{ marginTop: 2 }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>Option {i + 1}</div>
                      <div style={{ opacity: 0.9, lineHeight: 1.45 }}>{s}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Wordmark: ocupa todo el ancho */}
            <div
              className="previewCard previewFull"
              dangerouslySetInnerHTML={{ __html: preview.logoSVG }}
            />

            {/* Botón descarga: fila completa */}
            <div className="previewFull" style={{ marginTop: 4 }}>
              <button onClick={handleDownload} disabled={downloading} style={buttonStyle}>
                {downloading ? "Preparing ZIP…" : "Download Brand Kit"}
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  border: "1px solid #e5e5e5",
  borderRadius: 8,
  outline: "none",
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #e4d9c7",
  background: "#f1e6d6",
  cursor: "pointer",
};
