// app/page.tsx
"use client";
import { useState } from "react";

type Kit = {
  style: string;
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
    } finally {
      setLoading(false);
    }
  }

  function copy(text: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  }

  return (
    <main className="min-h-screen" style={{ background: "#efe6d8", color: "#1f1b16" }}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-serif mb-2">ByOlisJo Brand Kit Lite</h1>
        <p className="opacity-80 mb-8">
          Describe tu marca y obtén un kit visual & de voz en segundos.
        </p>

        <form onSubmit={onGenerate} className="bg-white/75 border border-[#e6dfd4] rounded-2xl p-4 md:p-5 shadow-sm">
          <label className="block text-sm mb-2">Describe tu marca</label>
          <input
            value={prompt}
            onChange={(e)=>setPrompt(e.target.value)}
            placeholder={`ej: "moderna, femenina, elegante, beige y dorado, joyas artesanales"`}
            className="w-full rounded-xl px-3 py-2 border border-black/10 focus:outline-none"
          />
          <button
            disabled={loading}
            className="mt-3 rounded-xl px-4 py-2 border border-[#cbb89a] bg-gradient-to-b from-[#f9f4ec] to-[#efe6d9] hover:-translate-y-[1px] transition"
            type="submit"
          >
            {loading ? "Generando…" : "Generar Kit"}
          </button>
        </form>

        {error && <p className="mt-4 text-red-700">{error}</p>}

        {data && (
          <section className="mt-8 space-y-6">
            <div className="bg-white border border-[#e6dfd4] rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Paleta — {data.palette.name}</h2>
                <span className="text-xs px-2 py-1 border border-[#cbb89a] rounded-full">
                  Estilo: {data.style}
                </span>
              </div>

              <div className="flex gap-2 mt-3 flex-wrap">
                {data.palette.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => copy(c)}
                    title={`Copiar ${c}`}
                    className="h-12 w-12 rounded-lg border border-[#e6dfd4]"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <p className="mt-2 text-sm opacity-80">{data.palette.colors.join(" · ")}</p>
            </div>

            <div className="bg-white border border-[#e6dfd4] rounded-2xl p-4 shadow-sm">
              <h3 className="font-medium">Tipografías</h3>
              <p className="opacity-80 text-sm">
                Heading: <b>{data.font.heading}</b> — Body: <b>{data.font.body}</b>
              </p>
            </div>

            <div className="bg-white border border-[#e6dfd4] rounded-2xl p-4 shadow-sm">
              <h3 className="font-medium">Voz de marca</h3>
              <p className="opacity-80">{data.voice}</p>
            </div>

            <div className="bg-white border border-[#e6dfd4] rounded-2xl p-4 shadow-sm">
              <h3 className="font-medium">Slogan propuesto</h3>
              <div
                className="grid grid-cols-[20px_1fr] gap-3 p-3 rounded-lg"
                style={{ background: "#ffffff", border: "1px solid #e6dfd4" }}
              >
                <span>✨</span>
                <span>{data.slogan}</span>
              </div>
            </div>

            <div className="bg-white border border-[#e6dfd4] rounded-2xl p-4 shadow-sm">
              <h3 className="font-medium">3 posts de arranque</h3>
              <ul className="list-disc pl-5 opacity-90">
                {data.posts.map((p, i) => (
                  <li key={i}><b>{p.title}:</b> {p.copy}</li>
                ))}
              </ul>
            </div>

            <a
              href={data.canvaSearch}
              target="_blank"
              className="inline-block rounded-xl px-4 py-2 border border-[#cbb89a] bg-gradient-to-b from-[#f9f4ec] to-[#efe6d9]"
            >
              Abrir ideas relacionadas en Canva
            </a>

            <p className="opacity-70 text-sm">{data.tip}</p>
          </section>
        )}
      </div>
    </main>
  );
}

