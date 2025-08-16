// app/api/zip/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // Aquí luego generamos el ZIP real con JSZip.
    return new NextResponse("OK", { status: 200 });
  } catch (e: any) {
    return new NextResponse(
      JSON.stringify({ error: e?.message ?? "Server error" }),
      { status: 500 }
    );
  }
}
