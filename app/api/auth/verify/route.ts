import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import {
  readNonce,
  setSessionCookie,
  clearAuthCookies,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      address?: string;
      signature?: string;
      message?: string;
    };

    const address = body.address;
    const signature = body.signature;
    const message = body.message;
    const nonce = readNonce(req);

    if (
      !address ||
      !signature ||
      !message ||
      !nonce ||
      !ethers.isAddress(address)
    ) {
      return NextResponse.json(
        { error: "Invalid authentication payload." },
        { status: 400 }
      );
    }

    if (!message.includes(`Nonce: ${nonce}`)) {
      return NextResponse.json(
        { error: "Nonce mismatch." },
        { status: 401 }
      );
    }

    if (!message.includes("Robinhood Chain (4663)")) {
      return NextResponse.json(
        { error: "Wrong network." },
        { status: 401 }
      );
    }

    const recovered = ethers.verifyMessage(message, signature);

    if (
      ethers.getAddress(recovered) !== ethers.getAddress(address)
    ) {
      return NextResponse.json(
        { error: "Signature does not belong to wallet." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      ok: true,
      address: ethers.getAddress(address),
    });

    clearAuthCookies(response);
    setSessionCookie(response, address);

    return response;
  } catch {
    return NextResponse.json(
      { error: "Signature verification failed." },
      { status: 401 }
    );
  }
}