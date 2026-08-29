import { NextRequest, NextResponse } from "next/server";
import { db, initDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const wallet = req.nextUrl.searchParams
      .get("wallet")
      ?.toLowerCase();

    const after = req.nextUrl.searchParams.get(
      "after"
    );

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet is required." },
        { status: 400 }
      );
    }

    await initDb();

    const events = after
      ? await db<{
          id: string;
          task_id: string;
          message: string;
          created_at: string;
        }>(
          `
          SELECT
            id,
            task_id,
            message,
            created_at
          FROM worker_events
          WHERE LOWER(owner) = LOWER($1)
            AND created_at > (
              SELECT created_at
              FROM worker_events
              WHERE id = $2
              LIMIT 1
            )
          ORDER BY created_at ASC
          LIMIT 50
          `,
          [wallet, after]
        )
      : await db<{
          id: string;
          task_id: string;
          message: string;
          created_at: string;
        }>(
          `
          SELECT
            id,
            task_id,
            message,
            created_at
          FROM worker_events
          WHERE LOWER(owner) = LOWER($1)
          ORDER BY created_at DESC
          LIMIT 20
          `,
          [wallet]
        );

    return NextResponse.json(
      {
        ok: true,
        events,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error(
      "Latest events error:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load events.",
      },
      { status: 500 }
    );
  }
}