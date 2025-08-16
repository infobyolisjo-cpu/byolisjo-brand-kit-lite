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
    <main className="min-h-screen bg-[#efe6d8] text-[#1f1b16]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-semibold mb-2">ByOlisJo Brand Kit Lite</h1>
        <p className="opacity-80 mb-8">Describe tu marca y obtén un kit visual & de voz en segundos.</p>

        <form onSubmit={onGenerate} className="bg-white/70 rounded-2xl p-4 shadow">
          <label className="block text-sm mb-2">Describe tu marca</label>
          <input
            value={prompt}
            onChange={e=>setPrompt(e.target.value)}
            placeholder={`ej: "moderna, femenina, elegante, beige y dorado, joyas artesanales"`}
            className="w-full rounded-xl px-3 py-2 border border-black/10 focus:outline-none"
          />
          <button disabled={loading} className="mt-3 rounded-xl px-4 py-2 border">
            {loading ? "Generando…" : "Generar Kit"}
          </button>
        </form>

        {error && <p className="mt-4 text-red-700">{error}</p>}

        {data && (
          <section className="mt-8 space-y-6">
            <div className="bg-white rounded-2xl p-4 shadow">
              <h2 className="text-xl font-semibold">Paleta — {data.palette.name}</h2>
              <div className="flex gap-2 mt-3">
                {data.palette.colors.map((c:string)=>(
                  <div key={c} className="h-12 w-12 rounded-lg border" style={{background:c}} title={c}/>
                ))}
              </div>
              <p className="mt-2 text-sm opacity-80">{data.palette.colors.join(" · ")}</p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow">
              <h3 className="font-medium">Tipografías</h3>
              <p className="opacity-80 text-sm">Heading: <b>{data.font.heading}</b> — Body: <b>{data.font.body}</b></p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow">
              <h3 className="font-medium">Voz de marca</h3>
              <p className="opacity-80">{data.voice}</p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow">
              <h3 className="font-medium">Slogan propuesto</h3>
              <p className="opacity-80">{data.slogan}</p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow">
              <h3 className="font-medium">3 posts de arranque</h3>
              <ul className="list-disc pl-5 opacity-90">
                {data.posts.map((p:any,i:number)=>(
                  <li key={i}><b>{p.title}:</b> {p.copy}</li>
                ))}
              </ul>
            </div>

            <a href={data.canvaSearch} target="_blank" className="inline-block rounded-xl px-4 py-2 border">
              Abrir ideas relacionadas en Canva
            </a>

            <p className="opacity-70 text-sm">{data.tip}</p>
          </section>
        )}
      </div>
    </main>
  );
}
