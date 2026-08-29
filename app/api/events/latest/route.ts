import { NextRequest } from "next/server";
import { db, initDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  await initDb();

  const encoder = new TextEncoder();

  const wallet = req.nextUrl.searchParams
    .get("wallet")
    ?.toLowerCase();

  if (!wallet) {
    return new Response(
      JSON.stringify({
        error: "Wallet is required.",
      }),
      {
        status: 400,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      let lastEventId = "";

      const send = (data: unknown) => {
        try {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify(data)}\n\n`
            )
          );
        } catch {
          // Client disconnected.
        }
      };

      const sendComment = (text: string) => {
        try {
          controller.enqueue(
            encoder.encode(`: ${text}\n\n`)
          );
        } catch {
          // Client disconnected.
        }
      };

      /*
       * First connection:
       * remember the newest event so old events
       * are not pushed again.
       */
      try {
        const latest = await db<{
          id: string;
          created_at: string;
        }>(
          `
            SELECT id, created_at
            FROM worker_events
            WHERE LOWER(owner) = LOWER($1)
            ORDER BY created_at DESC
            LIMIT 1
          `,
          [wallet]
        );

        lastEventId = latest[0]?.id ?? "";
      } catch (error) {
        console.error(
          "SSE initial query failed:",
          error
        );
      }

      send({
        type: "connected",
        timestamp: new Date().toISOString(),
      });

      /*
       * Check database frequently.
       *
       * This is server-side only.
       * Browser keeps ONE SSE connection.
       */
      const interval = setInterval(async () => {
        try {
          const events = await db<{
            id: string;
            task_id: string;
            owner: string;
            message: string;
            event_key: string;
            created_at: string;
          }>(
            `
              SELECT
                id,
                task_id,
                owner,
                message,
                event_key,
                created_at
              FROM worker_events
              WHERE LOWER(owner) = LOWER($1)
                AND (
                  $2 = ''
                  OR created_at >= (
                    SELECT created_at
                    FROM worker_events
                    WHERE id = $2
                    LIMIT 1
                  )
                )
              ORDER BY created_at ASC
              LIMIT 20
            `,
            [wallet, lastEventId]
          );

          for (const event of events) {
            if (
              event.id === lastEventId
            ) {
              continue;
            }

            lastEventId = event.id;

            send({
              type: "event",
              event,
            });
          }

          sendComment(
            `heartbeat ${Date.now()}`
          );
        } catch (error) {
          console.error(
            "SSE database check failed:",
            error
          );
        }
      }, 1000);

      const abortHandler = () => {
        clearInterval(interval);

        try {
          controller.close();
        } catch {
          // Already closed.
        }
      };

      req.signal.addEventListener(
        "abort",
        abortHandler
      );
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":
        "text/event-stream; charset=utf-8",
      "Cache-Control":
        "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}