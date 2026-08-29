import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";

const SESSION_COOKIE = "sc_session";
const NONCE_COOKIE = "sc_nonce";

function secret(): string {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    throw new Error("AUTH_SECRET must be at least 32 characters.");
  }
  return value;
}

function hmac(value: string): string {
  return crypto
    .createHmac("sha256", secret())
    .update(value)
    .digest("hex");
}

export function makeNonce(): string {
  return crypto.randomBytes(24).toString("hex");
}

export function createSession(address: string): string {
  const normalized = ethers.getAddress(address).toLowerCase();
  const payload = `${normalized}:${Date.now()}`;
  return `${Buffer.from(payload).toString("base64url")}.${hmac(payload)}`;
}

export function readSession(req: NextRequest): string | null {
  const raw = req.cookies.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  const [encoded, signature] = raw.split(".");
  if (!encoded || !signature) return null;

  try {
    const payload = Buffer.from(encoded, "base64url").toString("utf8");
    const expected = hmac(payload);

    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expected)
      )
    ) {
      return null;
    }

    const [address, issuedAt] = payload.split(":");
    const timestamp = Number(issuedAt);

    if (!ethers.isAddress(address)) return null;
    if (!Number.isFinite(timestamp)) return null;

    // 7-day session.
    if (Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000) {
      return null;
    }

    return ethers.getAddress(address);
  } catch {
    return null;
  }
}

export function setNonceCookie(
  response: NextResponse,
  nonce: string
) {
  response.cookies.set(NONCE_COOKIE, nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
  });
}

export function readNonce(req: NextRequest): string | null {
  return req.cookies.get(NONCE_COOKIE)?.value ?? null;
}

export function setSessionCookie(
  response: NextResponse,
  address: string
) {
  response.cookies.set(SESSION_COOKIE, createSession(address), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.delete(SESSION_COOKIE);
  response.cookies.delete(NONCE_COOKIE);
}

export function authRequired(req: NextRequest): string {
  const address = readSession(req);
  if (!address) {
    throw new Error("UNAUTHORIZED");
  }
  return address;
}