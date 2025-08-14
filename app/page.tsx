'use client';

import { useState } from 'react';
import Link from 'next/link';

type Result = {
  colors: string[];
  slogan: string;
  name: string;
};

export default function Home() {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [aud, setAud] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onGenerate = async () => {
    setError(null);
    if (!name || !desc || !aud) {
      setError('Please fill all fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, desc, aud }),
      });
      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      setResult(data);
    } catch (e:any) {
      setError(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="card">
        <h2 className="font-serif text-xl mb-2">Your Brand Identity in Minutes</h2>
        <p className="opacity-80 mb-4">
          Get your color palette, slogan, and a clean wordmark logo. Test mode only — connect Stripe later.
        </p>
        <div className="grid gap-3">
          <div>
            <label className="text-sm opacity-80">Business name</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Luna Essence" />
          </div>
          <div>
            <label className="text-sm opacity-80">Short description</label>
            <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Handcrafted jewelry with moon-inspired stones" />
          </div>
          <div>
            <label className="text-sm opacity-80">Main target audience</label>
            <input value={aud} onChange={e=>setAud(e.target.value)} placeholder="Women 25–45 who value artisanal design" />
          </div>
          <button onClick={onGenerate} disabled={loading}>{loading ? 'Generating…' : 'Generate My Brand Kit'}</button>
          {error && <div className="badge" style={{borderColor:'#c55', color:'#c55'}}>{error}</div>}
        </div>
      </div>

      {result && (
        <div className="card" style={{marginTop:16}}>
          <h3 className="font-serif text-lg mb-2">Preview</h3>
          <div className="mb-3">
            <div className="flex" style={{gap:8, flexWrap:'wrap'}}>
              {result.colors.map((c,i)=>(
                <div key={i} style={{width:72, height:48, borderRadius:12, border:'1px solid #e4d8c6', background:c}} title={c}>
                  <div style={{fontSize:11, textAlign:'center', marginTop:30, background:'rgba(255,255,255,.7)'}}>{c}</div>
                </div>
              ))}
            </div>
          </div>
          <p className="mb-2"><strong>Slogan:</strong> {result.slogan}</p>
          <div className="mb-4">
            <Link
              href={`/pay?name=${encodeURIComponent(result.name)}&slogan=${encodeURIComponent(result.slogan)}&colors=${encodeURIComponent(result.colors.join(','))}`}
            >
              <button>Proceed to Checkout (Test)</button>
            </Link>
          </div>
          <p className="text-xs opacity-70">Test Mode: you can complete checkout with Stripe testing cards.</p>
        </div>
      )}
    </main>
  );
}
