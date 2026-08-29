import crypto from "crypto";
import { ethers } from "ethers";
import { db, initDb } from "./db";
import { getAddressTransactions } from "./blockscout";
import { getCollectionEvents, getCollectionStats } from "./opensea";
import { sendAlert } from "./alerts";

type TaskRow = {
  id: string;
  owner: string;
  type: "wallet" | "floor" | "mint";
  target: string;
  condition: string;
  last_event_key: string | null;
};

function eventId(): string {
  return crypto.randomUUID();
}

function isFloorConditionMet(
  condition: string,
  floor: number
): boolean {
  const match = condition.trim().match(/^(<=|>=|<|>)\s*([0-9]*\.?[0-9]+)$/);

  if (!match) {
    return false;
  }

  const operator = match[1];
  const threshold = Number(match[2]);

  if (!Number.isFinite(threshold)) return false;

  switch (operator) {
    case "<": return floor < threshold;
    case "<=": return floor <= threshold;
    case ">": return floor > threshold;
    case ">=": return floor >= threshold;
    default: return false;
  }
}

async function runWalletTask(task: TaskRow) {
  if (!ethers.isAddress(task.target)) {
    return null;
  }

  const data = await getAddressTransactions(task.target);
  const latest = data?.items?.[0];

  if (!latest?.hash) return null;

  const hash = String(latest.hash);

  if (hash === task.last_event_key) {
    return null;
  }

  const message =
    `🖥️ SUPER COMPUTER ALERT\n\n` +
    `Wallet activity detected.\n\n` +
    `Wallet: ${task.target}\n` +
    `Tx: ${hash}\n` +
    `Block: ${latest.block_number ?? "—"}\n\n` +
    `Your Computer found a new event.`;

  return {
    eventKey: hash,
    message,
  };
}

async function runFloorTask(task: TaskRow) {
  const data = await getCollectionStats(task.target);
  const floor = Number(data?.total?.floor_price ?? NaN);

  if (!Number.isFinite(floor)) return null;
  if (!isFloorConditionMet(task.condition, floor)) return null;

  const rounded = floor.toPrecision(8);
  const eventKey = `floor:${rounded}:${task.condition}`;

  if (eventKey === task.last_event_key) return null;

  const message =
    `🖥️ SUPER COMPUTER ALERT\n\n` +
    `Floor condition triggered.\n\n` +
    `Collection: ${task.target}\n` +
    `Floor: ${rounded} ETH\n` +
    `Condition: ${task.condition}\n\n` +
    `Your Computer is done watching.`;

  return {
    eventKey,
    message,
  };
}

async function runMintTask(task: TaskRow) {
  const data = await getCollectionEvents(
    task.target,
    "mint"
  );

  const latest =
    data?.asset_events?.[0] ??
    data?.events?.[0];

  if (!latest) {
    return null;
  }

  const identifier =
    latest?.id ??
    latest?.transaction?.hash ??
    `${latest?.nft?.identifier ?? "unknown"}:${latest?.event_timestamp ?? "unknown"}`;

  if (!identifier) {
    return null;
  }

  const eventKey = `mint:${String(identifier)}`;

  if (eventKey === task.last_event_key) {
    return null;
  }

  const message =
    `🖥️ SUPER COMPUTER ALERT\n\n` +
    `New mint activity detected.\n\n` +
    `Collection: ${task.target}\n` +
    `Event: ${String(identifier)}\n\n` +
    `Your Computer found new mint activity.`;

  return {
    eventKey,
    message,
  };
}

export async function runWorker() {
  await initDb();

  const tasks = await db<TaskRow>(`
    SELECT id, owner, type, target, condition, last_event_key
    FROM worker_tasks
    WHERE active = TRUE
    ORDER BY created_at ASC
    LIMIT 500
  `);

  let checked = 0;
  let triggered = 0;

  for (const task of tasks) {
    checked++;

    try {
      let result: { eventKey: string; message: string } | null = null;

      if (task.type === "wallet") {
        result = await runWalletTask(task);
      } else if (task.type === "floor") {
        result = await runFloorTask(task);
      } else if (task.type === "mint") {
        result = await runMintTask(task);
      }

      await db(
        `UPDATE worker_tasks
         SET last_checked_at = NOW()
         WHERE id = $1`,
        [task.id]
      );

      if (!result) continue;

      await db(
        `INSERT INTO worker_events
          (id, task_id, owner, message, event_key)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (task_id, event_key) DO NOTHING`,
        [
          eventId(),
          task.id,
          task.owner,
          result.message,
          result.eventKey,
        ]
      );

      await db(
        `UPDATE worker_tasks
         SET last_triggered_at = NOW(),
             last_event_key = $2,
             last_checked_at = NOW()
         WHERE id = $1`,
        [task.id, result.eventKey]
      );

      await sendAlert(result.message);

      triggered++;
    } catch (error) {
      console.error("Worker task failed", task.id, error);
    }
  }

  return { checked, triggered };
}