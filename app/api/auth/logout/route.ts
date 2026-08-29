import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/auth";

export async function POST(_req: NextRequest) {
  const response = NextResponse.json({ ok: true });
  clearAuthCookies(response);
  return response;
}