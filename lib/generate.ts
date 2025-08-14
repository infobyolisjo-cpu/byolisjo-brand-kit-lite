// Simple deterministic helpers: palette, slogan, and wordmark logo (SVG)

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return Math.abs(h >>> 0);
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c/2;
  let r=0,g=0,b=0;
  if (0<=h && h<60){ r=c; g=x; b=0; }
  else if (60<=h && h<120){ r=x; g=c; b=0; }
  else if (120<=h && h<180){ r=0; g=c; b=x; }
  else if (180<=h && h<240){ r=0; g=x; b=c; }
  else if (240<=h && h<300){ r=x; g=0; b=c; }
  else { r=c; g=0; b=x; }
  const toHex = (n:number)=> Math.round((n+m)*255).toString(16).padStart(2,'0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function generatePalette(seed: string) {
  const h = hashString(seed);
  const baseHue = h % 360;
  const s = 38 + (h % 12); // 38–49%
  const l = 40 + (h % 10); // 40–49%
  const palette = [
    hslToHex((baseHue + 0) % 360, s, l),
    hslToHex((baseHue + 25) % 360, s+8, l+6),
    hslToHex((baseHue + 200) % 360, Math.min(60, s+12), l+10),
    hslToHex((baseHue + 320) % 360, s+4, l+4),
    "#B08D57" // ByOlisJo gold accent
  ];
  // unique, keep 3–5
  const unique = Array.from(new Set(palette)).slice(0,5);
  return unique;
}

export function generateSlogan(name: string, desc: string, audience: string) {
  const verbs = ["Elevate","Inspire","Craft","Shine","Empower","Connect","Design"];
  const values = ["elegance","clarity","growth","creativity","impact","confidence","simplicity"];
  const v = verbs[(hashString(name+desc) % verbs.length)];
  const val = values[(hashString(audience+name) % values.length)];
  return `${v} your ${val} — ${name}`.slice(0, 60);
}

export function generateWordmarkSVG(name: string, hex: string) {
  const safeName = name.replace(/[^a-zA-Z0-9\s]/g, '').slice(0, 32);
  const initials = safeName.split(' ').map(w => w[0]).join('').slice(0,3).toUpperCase();
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400">
  <rect width="100%" height="100%" fill="#FFFFFF"/>
  <text x="80" y="230" font-family="Georgia, serif" font-size="160" font-weight="400" fill="${hex}">${safeName}</text>
  <circle cx="60" cy="190" r="36" fill="${hex}" />
  <text x="60" y="198" text-anchor="middle" font-family="Georgia, serif" font-size="28" font-weight="700" fill="#FFFFFF">${initials}</text>
</svg>`;
  return svg;
}
