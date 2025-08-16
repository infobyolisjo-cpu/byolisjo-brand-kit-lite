import { NextRequest, NextResponse } from 'next/server';
<<<<<<< HEAD
import { generatePalette, generateSlogan } from '@/lib/generate';
=======
import { generatePalette, generateSlogans, generateWordmarkSVG } from '../../../lib/generate';
>>>>>>> 4519612185e08ac69cc8235c6adeafe63cbd010e

export async function POST(req: NextRequest) {
  try {
    const { name, desc, aud } = await req.json();
    if (!name || !desc || !aud) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
<<<<<<< HEAD
    const colors = generatePalette(name + '|' + desc + '|' + aud).slice(0,4);
    const slogan = generateSlogan(name, desc, aud);
    return NextResponse.json({ name, colors, slogan });
  } catch (e:any) {
=======

    const colors = generatePalette(`${name} | ${desc} | ${aud}`).slice(0, 4);
    const slogans = generateSlogans(name, desc, aud);
    const primary = colors[0];
    const logoSVG = generateWordmarkSVG(name, primary);

    return NextResponse.json({ name, colors, slogans, logoSVG });
  } catch (e: any) {
>>>>>>> 4519612185e08ac69cc8235c6adeafe63cbd010e
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
