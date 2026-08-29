import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { makeNonce, setNonceCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { address?: string };
    const address = body.address;

    if (!address || !ethers.isAddress(address)) {
      return NextResponse.json(
        { error: "Invalid wallet address." },
        { status: 400 }
      );
    }

    const normalized = ethers.getAddress(address);
    const nonce = makeNonce();

    const response = NextResponse.json({
      message:
        `Super Computers wants you to sign in.\n\n` +
        `Wallet: ${normalized}\n` +
        `Network: Robinhood Chain (4663)\n` +
        `Nonce: ${nonce}\n\n` +
        `This signature does not send a transaction and does not cost gas.`,
    });

    setNonceCookie(response, nonce);

    return response;
  } catch {
    return NextResponse.json(
      { error: "Unable to create authentication challenge." },
      { status: 500 }
    );
  }
}