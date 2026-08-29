import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db, initDb } from "@/lib/db";
import { sendAlert } from "@/lib/alerts";
import {
  ALCHEMY_WEBHOOK_SECRET,
  NFT_CONTRACT,
} from "@/lib/config";

export const runtime = "nodejs";

const ZERO_ADDRESS =
  "0x0000000000000000000000000000000000000000";

const TRANSFER_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

const NFT_CONTRACT_LOWER =
  NFT_CONTRACT.toLowerCase();

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

  const expected =
    crypto
      .createHmac(
        "sha256",
        ALCHEMY_WEBHOOK_SECRET
      )
      .update(rawBody, "utf8")
      .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, "utf8"),
      Buffer.from(signature, "utf8")
    );
  } catch {
    return false;
  }
}

/* ==========================================================
   PAD HEX ADDRESS
========================================================== */

function topicToAddress(
  topic?: string
): string | null {
  if (!topic) {
    return null;
  }

  const value = topic.replace(
    /^0x/,
    ""
  );

  if (value.length < 40) {
    return null;
  }

  return (
    "0x" +
    value.slice(-40)
  ).toLowerCase();
}

/* ==========================================================
   TOKEN ID
========================================================== */

function topicToTokenId(
  topic?: string
): string | null {
  if (!topic) {
    return null;
  }

  const clean =
    topic.replace(
      /^0x/,
      ""
    );

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
   FIND LOGS SAFELY
========================================================== */

function extractLogs(
  payload: WebhookPayload
): AlchemyLog[] {
  return (
    payload?.event?.data?.block?.logs ?? []
  );
}

/* ==========================================================
   CHECK IF LOG IS NFT MINT
========================================================== */

function isMintLog(
  log: AlchemyLog
): boolean {
  const contract =
    log?.account?.address?.toLowerCase();

  if (
    !contract ||
    contract !== NFT_CONTRACT_LOWER
  ) {
    return false;
  }

  const topics =
    Array.isArray(log.topics)
      ? log.topics
      : [];

  if (
    !topics[0] ||
    topics[0].toLowerCase() !==
      TRANSFER_TOPIC
  ) {
    return false;
  }

  /*
    ERC-721 Transfer:
    
    topics[0] = Transfer(address,address,uint256)
    topics[1] = from
    topics[2] = to
    topics[3] = tokenId

    Mint:
    from = 0x000...000
  */

  const from =
    topicToAddress(topics[1]);

  if (!from) {
    return false;
  }

  return (
    from === ZERO_ADDRESS
  );
}

/* ==========================================================
   CREATE EVENT KEY
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
    String(blockNumber ?? "unknown"),
  ].join(":");
}

/* ==========================================================
   POST
========================================================== */

export async function POST(
  req: NextRequest
) {
  try {
    /*
      IMPORTANT:
      We must verify the ORIGINAL raw body.
    */

    const rawBody =
      await req.text();

    const signature =
      req.headers.get(
        "x-alchemy-signature"
      ) ?? "";

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
      Ignore anything that isn't a GraphQL webhook.
    */

    if (
      payload.type &&
      payload.type !== "GRAPHQL"
    ) {
      return NextResponse.json({
        ok: true,
        ignored: true,
        reason:
          "Unsupported webhook type.",
      });
    }

    await initDb();

    const logs =
      extractLogs(payload);

    const block =
      payload?.event?.data?.block;

    const blockNumber =
      block?.number;

    let checked = 0;
    let triggered = 0;

    /*
      Process every matching mint in the block.
    */

    for (const log of logs) {
      if (!isMintLog(log)) {
        continue;
      }

      checked++;

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
        Find active MINT workers.
        
        We match the target against the configured
        OpenSea slug. Since this webhook is specifically
        attached to the Super Computers contract, active
        MINT watchers for this collection can react.
      */

      const tasks =
        await db<{
          id: string;
          owner: string;
          target: string;
        }>(`
          SELECT
            id,
            owner,
            target
          FROM worker_tasks
          WHERE active = TRUE
            AND type = 'mint'
            AND LOWER(target) = LOWER($1)
          ORDER BY created_at ASC
          LIMIT 500
        `, [
          "super-computers",
        ]);

      for (const task of tasks) {
        const message =
          `🖥️ SUPER COMPUTER ALERT\n\n` +
          `New mint detected.\n\n` +
          `Collection: ${task.target}\n` +
          `Token: #${tokenId}\n` +
          `Recipient: ${recipient}\n` +
          `Tx: ${txHash}\n` +
          `Block: ${blockNumber ?? "—"}\n\n` +
          `Your Computer detected the mint.`;

        /*
          Insert only once.
          
          Your existing DB constraint:
          ON CONFLICT (task_id, event_key)
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

        if (
          inserted.length === 0
        ) {
          continue;
        }

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

        try {
          await sendAlert(
            message
          );
        } catch (alertError) {
          /*
            Alert failure should NOT undo
            the successful database event.
          */

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