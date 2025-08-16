"use client";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const json = await res.json();
      console.log("Kit:", json);
      alert("¡Kit generado! (abre la consola para ver los datos)");
    } catch {
      alert("Hubo un problema al generar el kit.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#efe6d8] text-[#1f1b16]">
      <header className="mx-auto max-w-5xl px-6 pt-14 text-center">
        <span className="inline-block rounded-full border px-3 py-1 text-xs tracking-wide">
          ByOlisJo — Brand Kit Lite
        </span>
        <h1 className="mt-5 text-4xl md:text-6xl font-extrabold leading-tight">
          Identidad <span className="underline decoration-[#c3a572]">premium</span> en 3 minutos
        </h1>
        <p className="mt-4 text-lg opacity-80">
          Describe tu marca y te damos paleta, tipografías, voz y eslogan listos para usar.
        </p>
      </header>

      <section className="mx-auto mt-10 max-w-3xl px-6">
        <form onSubmit={onGenerate} className="rounded-2xl bg-white/80 shadow p-4 md:p-6 border border-black/10">
          <label className="block text-sm font-medium mb-2">Describe tu marca</label>
          <div className="flex gap-2">
            <input
              value={prompt}
              onChange={(e)=>setPrompt(e.target.value)}
              placeholder='ej: "moderna, femenina, elegante, beige y dorado, joyas artesanales"'
              className="flex-1 rounded-xl border border-black/10 px-4 py-3 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl px-5 py-3 bg-[#c3a572] text-white font-semibold disabled:opacity-60"
            >
              {loading ? "Generando…" : "Generar Kit"}
            </button>
          </div>
          <p className="mt-2 text-xs opacity-70">Tip: pega adjetivos, estilo y colores.</p>
        </form>

        <p className="mt-5 text-center text-sm opacity-70">
          Versión lite • sin registro • pensado para emprendedoras
        </p>
      </section>

      <footer className="mx-auto max-w-5xl px-6 py-12 text-sm opacity-70 text-center">
        © {new Date().getFullYear()} ByOlisJo — beige & gold aesthetic
      </footer>
    </main>
  );
}
