import { NextRequest, NextResponse } from "next/server";
import { authRequired } from "@/lib/auth";
import { assertHolder } from "@/lib/ownership";
import { initDb, db } from "@/lib/db";
import { getAccountNFTs } from "@/lib/opensea";

type EventRow = {
  id: string;
  task_id: string;
  message: string;
  created_at: string;
};

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const address = authRequired(req);
    const balance = await assertHolder(address);

    await initDb();

    const tasks = await db(`
      SELECT
        id,
        type,
        target,
        condition,
        active,
        last_checked_at,
        last_triggered_at,
        created_at
      FROM worker_tasks
      WHERE owner = $1
      ORDER BY created_at DESC
    `, [address.toLowerCase()]);

    const events = await db<EventRow>(`
      SELECT id, task_id, message, created_at
      FROM worker_events
      WHERE owner = $1
      ORDER BY created_at DESC
      LIMIT 20
    `, [address.toLowerCase()]);

    let nfts: unknown = null;

    try {
      nfts = await getAccountNFTs(address);
    } catch {
      nfts = null;
    }

    return NextResponse.json({
      wallet: address,
      balance: balance.toString(),
      tasks,
      events,
      nfts,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load account.";

    if (
      message === "UNAUTHORIZED" ||
      message === "WALLET_DOES_NOT_OWN_COMPUTER"
    ) {
      return NextResponse.json({ error: message }, { status: 401 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}