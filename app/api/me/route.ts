import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";

import {
  authRequired,
} from "@/lib/auth";

import {
  db,
  initDb,
} from "@/lib/db";

import {
  getAccountNFTs,
} from "@/lib/opensea";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TaskRow = {
  id: string;
  type: "wallet" | "floor" | "mint";
  target: string;
  condition: string;
  active: boolean;
  last_checked_at: string | null;
  last_triggered_at: string | null;
  created_at: string;
};

type EventRow = {
  id: string;
  task_id: string;
  message: string;
  created_at: string;
};

export async function GET(
  req: NextRequest
) {
  try {
    /*
     * Read authenticated wallet
     * from sc_session cookie.
     */
    const wallet =
      authRequired(req);

    await initDb();

    /*
     * Load worker tasks.
     */
    const tasks =
      await db<TaskRow>(
        `
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
        WHERE LOWER(owner) = LOWER($1)
        ORDER BY created_at DESC
        `,
        [wallet]
      );

    /*
     * Load signal events.
     */
    const events =
      await db<EventRow>(
        `
        SELECT
          id,
          task_id,
          message,
          created_at
        FROM worker_events
        WHERE LOWER(owner) = LOWER($1)
        ORDER BY created_at DESC
        LIMIT 100
        `,
        [wallet]
      );

    /*
     * Get native ETH balance.
     */
    let balance = "0";

    try {
      const provider =
        new ethers.JsonRpcProvider(
          process.env.NEXT_PUBLIC_RPC_URL ||
            "https://rpc.mainnet.chain.robinhood.com"
        );

      const rawBalance =
        await provider.getBalance(
          wallet
        );

      balance =
        ethers.formatEther(
          rawBalance
        );
    } catch (balanceError) {
      console.error(
        "Balance loading failed:",
        balanceError
      );
    }

    /*
     * Load Super Computers owned
     * by the authenticated wallet.
     */
    let nfts: unknown = [];

    try {
      nfts =
        (await getAccountNFTs(
          wallet
        )) ?? [];
    } catch (nftError) {
      console.error(
        "NFT loading failed:",
        nftError
      );
    }

    /*
     * If the wallet has no NFTs,
     * the dashboard can still load.
     */
    const nftItems =
      (nfts as any)?.nfts ??
      (nfts as any)?.items ??
      (Array.isArray(nfts)
        ? nfts
        : []);

    /*
     * The frontend expects this shape:
     *
     * {
     *   wallet,
     *   balance,
     *   tasks,
     *   events,
     *   nfts
     * }
     */
    return NextResponse.json(
      {
        wallet,
        balance,
        tasks,
        events,
        nfts: nftItems,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          error:
            "UNAUTHORIZED",
        },
        {
          status: 401,
        }
      );
    }

    console.error(
      "ME endpoint failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "ACCOUNT LOAD FAILED",
      },
      {
        status: 500,
      }
    );
  }
}