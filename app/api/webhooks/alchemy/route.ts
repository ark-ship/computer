import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { db, initDb } from "@/lib/db";
import { sendAlert } from "@/lib/alerts";
import {
  ALCHEMY_WEBHOOK_SECRET,
} from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ZERO_ADDRESS =
  "0x0000000000000000000000000000000000000000";

const TRANSFER_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

/* ==========================================================
   TYPES
========================================================== */

type AlchemyLog = {
  account?: {
    address?: string;
  };

  topics?: string[];

  data?: string;

  index?: number;

  transaction?: {
    hash?: string;

    index?: number;

    from?: {
      address?: string;
    };

    to?: {
      address?: string;
    };
  };
};

type WebhookPayload = {
  webhookId?: string;

  id?: string;

  createdAt?: string;

  type?: string;

  event?: {
    data?: {
      block?: {
        hash?: string;

        number?: string | number;

        timestamp?: string;

        logs?: AlchemyLog[];
      };
    };

    sequenceNumber?: string;
  };
};

/* ==========================================================
   VERIFY ALCHEMY SIGNATURE
========================================================== */

function verifyAlchemySignature(
  rawBody: string,
  signature: string
): boolean {
  if (!ALCHEMY_WEBHOOK_SECRET) {
    console.error(
      "ALCHEMY_WEBHOOK_SECRET is missing."
    );

    return false;
  }

  if (!signature) {
    return false;
  }

  const expected = crypto
    .createHmac(
      "sha256",
      ALCHEMY_WEBHOOK_SECRET
    )
    .update(rawBody, "utf8")
    .digest("hex");

  const expectedBuffer =
    Buffer.from(expected, "utf8");

  const receivedBuffer =
    Buffer.from(signature, "utf8");

  if (
    expectedBuffer.length !==
    receivedBuffer.length
  ) {
    return false;
  }

  try {
    return crypto.timingSafeEqual(
      expectedBuffer,
      receivedBuffer
    );
  } catch {
    return false;
  }
}

/* ==========================================================
   TOPIC -> ADDRESS
========================================================== */

function topicToAddress(
  topic?: string
): string | null {
  if (!topic) {
    return null;
  }

  const value =
    topic.replace(/^0x/, "");

  if (value.length < 40) {
    return null;
  }

  return (
    "0x" +
    value.slice(-40)
  ).toLowerCase();
}

/* ==========================================================
   TOPIC -> TOKEN ID
========================================================== */

function topicToTokenId(
  topic?: string
): string | null {
  if (!topic) {
    return null;
  }

  const clean =
    topic.replace(/^0x/, "");

  if (!clean) {
    return null;
  }

  try {
    return BigInt(
      "0x" + clean
    ).toString();
  } catch {
    return null;
  }
}

/* ==========================================================
   EXTRACT LOGS
========================================================== */

function extractLogs(
  payload: WebhookPayload
): AlchemyLog[] {
  return (
    payload?.event?.data?.block?.logs ??
    []
  );
}

/* ==========================================================
   CHECK NFT MINT
========================================================== */

function isMintLog(
  log: AlchemyLog
): boolean {
  const topics =
    Array.isArray(log.topics)
      ? log.topics
      : [];

  /*
   * ERC-721 Transfer:
   *
   * topics[0] = Transfer(...)
   * topics[1] = from
   * topics[2] = to
   * topics[3] = tokenId
   */

  if (
    !topics[0] ||
    topics[0].toLowerCase() !==
      TRANSFER_TOPIC
  ) {
    return false;
  }

  const from =
    topicToAddress(topics[1]);

  if (!from) {
    return false;
  }

  /*
   * Mint happens when the NFT is transferred
   * from the zero address.
   */

  return (
    from === ZERO_ADDRESS
  );
}

/* ==========================================================
   EVENT KEY
========================================================== */

function createEventKey(
  log: AlchemyLog,
  blockNumber?: string | number
): string {
  const txHash =
    log?.transaction?.hash ??
    "unknown";

  const logIndex =
    log?.index ?? "0";

  const tokenId =
    topicToTokenId(
      log?.topics?.[3]
    ) ?? "unknown";

  return [
    "alchemy-mint",
    txHash,
    String(logIndex),
    tokenId,
    String(
      blockNumber ?? "unknown"
    ),
  ].join(":");
}

/* ==========================================================
   POST WEBHOOK
========================================================== */

export async function POST(
  req: NextRequest
) {
  try {
    /*
     * Read original request body.
     */
    const rawBody =
      await req.text();

    const signature =
      req.headers.get(
        "x-alchemy-signature"
      ) ?? "";

    /*
     * Verify Alchemy.
     */
    if (
      !verifyAlchemySignature(
        rawBody,
        signature
      )
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Invalid Alchemy signature.",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * Parse JSON.
     */
    let payload: WebhookPayload;

    try {
      payload =
        JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Invalid JSON payload.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Ignore unsupported webhook types.
     */
    if (
      payload.type &&
      payload.type !== "GRAPHQL"
    ) {
      return NextResponse.json({
        ok: true,
        ignored: true,
      });
    }

    await initDb();

    const logs =
      extractLogs(payload);

    const blockNumber =
      payload?.event?.data?.block
        ?.number;

    let checked = 0;
    let triggered = 0;

    /*
     * Process every log in the block.
     */
    for (const log of logs) {
      /*
       * Only ERC-721 mint events.
       */
      if (!isMintLog(log)) {
        continue;
      }

      checked++;

      const contractAddress =
        log?.account?.address
          ?.toLowerCase();

      if (!contractAddress) {
        continue;
      }

      const topics =
        Array.isArray(log.topics)
          ? log.topics
          : [];

      const tokenId =
        topicToTokenId(
          topics[3]
        );

      const recipient =
        topicToAddress(
          topics[2]
        );

      const txHash =
        log?.transaction?.hash ??
        null;

      if (
        !tokenId ||
        !recipient ||
        !txHash
      ) {
        continue;
      }

      const eventKey =
        createEventKey(
          log,
          blockNumber
        );

      /*
       * IMPORTANT:
       *
       * Match the incoming contract address
       * against the contract_address stored
       * on each MINT worker.
       */
      const tasks =
        await db<{
          id: string;
          owner: string;
          target: string;
        }>(
          `
          SELECT
            id,
            owner,
            target
          FROM worker_tasks
          WHERE active = TRUE
            AND type = 'mint'
            AND LOWER(contract_address) = LOWER($1)
          ORDER BY created_at ASC
          LIMIT 500
          `,
          [contractAddress]
        );

      /*
       * No users are watching this contract.
       */
      if (tasks.length === 0) {
        continue;
      }

      /*
       * Trigger every user watching
       * this collection.
       */
      for (const task of tasks) {
        const message =
          `🖥️ SUPER COMPUTER ALERT\n\n` +
          `New mint detected.\n\n` +
          `Collection: ${task.target}\n` +
          `Contract: ${contractAddress}\n` +
          `Token: #${tokenId}\n` +
          `Recipient: ${recipient}\n` +
          `Tx: ${txHash}\n` +
          `Block: ${blockNumber ?? "—"}\n\n` +
          `Your Computer detected the mint.`;

        /*
         * Prevent duplicate signal.
         */
        const inserted =
          await db<{
            id: string;
          }>(
            `
            INSERT INTO worker_events
              (
                id,
                task_id,
                owner,
                message,
                event_key
              )
            VALUES
              (
                $1,
                $2,
                $3,
                $4,
                $5
              )
            ON CONFLICT (
              task_id,
              event_key
            )
            DO NOTHING
            RETURNING id
            `,
            [
              crypto.randomUUID(),
              task.id,
              task.owner,
              message,
              eventKey,
            ]
          );

        /*
         * Duplicate event.
         */
        if (
          inserted.length === 0
        ) {
          continue;
        }

        /*
         * Update worker.
         */
        await db(
          `
          UPDATE worker_tasks
          SET
            last_checked_at = NOW(),
            last_triggered_at = NOW(),
            last_event_key = $2
          WHERE id = $1
          `,
          [
            task.id,
            eventKey,
          ]
        );

        /*
         * Optional alert system.
         */
        try {
          await sendAlert(
            message
          );
        } catch (alertError) {
          console.error(
            "Alert delivery failed:",
            alertError
          );
        }

        triggered++;
      }
    }

    return NextResponse.json({
      ok: true,
      webhook: true,
      checked,
      triggered,
      timestamp:
        new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      "Alchemy webhook error:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Webhook processing failed.",
      },
      {
        status: 500,
      }
    );
  }
}