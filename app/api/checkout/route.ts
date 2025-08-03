import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const priceId = process.env.STRIPE_PRICE_ID || '';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function POST(req: NextRequest) {
  try {
    const { name, slogan, colors } = await req.json();

    if (!stripeSecret || !priceId) {
      // Test-mode fallback: skip payment and go directly to download
      const url = `${baseUrl}/download?name=${encodeURIComponent(name)}&slogan=${encodeURIComponent(slogan)}&colors=${encodeURIComponent((colors||[]).join(','))}`;
      return NextResponse.json({ url });
    }

    const stripe = new Stripe(stripeSecret, { apiVersion: '2024-06-20' });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/download?name=${encodeURIComponent(name)}&slogan=${encodeURIComponent(slogan)}&colors=${encodeURIComponent((colors||[]).join(','))}`,
      cancel_url: `${baseUrl}/`,
      metadata: {
        name, slogan, colors: (colors||[]).join(','),
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (e:any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
