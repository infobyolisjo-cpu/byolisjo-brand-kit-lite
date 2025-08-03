import { NextRequest, NextResponse } from 'next/server';
import { generatePalette, generateSlogans, generateWordmarkSVG } from '../../../lib/generate';

export async function POST(req: NextRequest) {
  try {
    const { name, desc, aud } = await req.json();
    if (!name || !desc || !aud) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const colors = generatePalette(`${name} | ${desc} | ${aud}`).slice(0, 4);
    const slogans = generateSlogans(name, desc, aud);
    const primary = colors[0];
    const logoSVG = generateWordmarkSVG(name, primary);

    return NextResponse.json({ name, colors, slogans, logoSVG });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
