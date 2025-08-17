// app/api/checkout/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const name   = (body?.name ?? '') as string;
    const slogan = (body?.slogan ?? '') as string;
    const colors = (body?.colors ?? []) as string[];

    const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || vercelUrl || 'http://localhost:3000';

    const url =
      `${baseUrl}/download` +
      `?name=${encodeURIComponent(name)}` +
      `&slogan=${encodeURIComponent(slogan)}` +
      `&colors=${encodeURIComponent((colors || []).join(','))}`;

    return NextResponse.json({ url });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}

