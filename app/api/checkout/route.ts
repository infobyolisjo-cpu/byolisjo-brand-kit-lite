// app/api/checkout/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name = "", slogan = "", colors = [] } = await req.json();

    const origin =
      (req.headers.get("x-forwarded-proto") ?? "https") +
      "://" +
      (req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "localhost:3000");

    const url =
      `${origin}/download` +
      `?name=${encodeURIComponent(name)}` +
      `&slogan=${encodeURIComponent(slogan)}` +
      `&colors=${encodeURIComponent((colors as string[]).join(","))}`;

    return NextResponse.json({ url });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Bad request" }, { status: 400 });
  }
}
