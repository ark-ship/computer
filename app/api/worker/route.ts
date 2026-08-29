import { NextRequest, NextResponse } from "next/server";
import { runWorker } from "@/lib/worker";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;

  if (secret) {
    const incoming = req.headers.get("x-cron-secret");
    const authorization = req.headers.get("authorization");

    if (
      incoming !== secret &&
      authorization !== `Bearer ${secret}`
    ) {
      return NextResponse.json(
        { error: "Unauthorized worker request." },
        { status: 401 }
      );
    }
  }

  try {
    const result = await runWorker();

    return NextResponse.json({
      ok: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Worker failed.",
      },
      { status: 500 }
    );
  }
}