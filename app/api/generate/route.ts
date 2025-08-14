import { NextRequest, NextResponse } from 'next/server';
import { generatePalette, generateSlogan } from '@/lib/generate';

export async function POST(req: NextRequest) {
  try {
    const { name, desc, aud } = await req.json();
    if (!name || !desc || !aud) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const colors = generatePalette(name + '|' + desc + '|' + aud).slice(0,4);
    const slogan = generateSlogan(name, desc, aud);
    return NextResponse.json({ name, colors, slogan });
  } catch (e:any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
