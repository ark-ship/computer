import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { ethers } from "ethers";
import { authRequired } from "@/lib/auth";
import { assertHolder } from "@/lib/ownership";
import { db, initDb } from "@/lib/db";

const TASK_TYPES = new Set(["wallet", "floor", "mint"]);

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const owner = authRequired(req);
    await assertHolder(owner);
    await initDb();

    const body = (await req.json()) as {
      type?: string;
      target?: string;
      condition?: string;
    };

    const type = body.type;
    const target = body.target?.trim();
    const condition = body.condition?.trim();

    if (!type || !TASK_TYPES.has(type)) {
      return NextResponse.json(
        { error: "Invalid task type." },
        { status: 400 }
      );
    }

    if (!target || target.length > 180) {
      return NextResponse.json(
        { error: "Invalid target." },
        { status: 400 }
      );
    }

    if (!condition || condition.length > 180) {
      return NextResponse.json(
        { error: "Invalid condition." },
        { status: 400 }
      );
    }

    if (type === "wallet" && !ethers.isAddress(target)) {
      return NextResponse.json(
        { error: "Wallet Watcher target must be a valid EVM address." },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();

    await db(
      `INSERT INTO worker_tasks
        (id, owner, type, target, condition)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, owner.toLowerCase(), type, target, condition]
    );

    return NextResponse.json({
      ok: true,
      task: {
        id,
        type,
        target,
        condition,
        active: true,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create task.";

    if (
      message === "UNAUTHORIZED" ||
      message === "WALLET_DOES_NOT_OWN_COMPUTER"
    ) {
      return NextResponse.json({ error: message }, { status: 401 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const owner = authRequired(req);
    await initDb();

    const body = (await req.json()) as {
      id?: string;
      active?: boolean;
    };

    if (!body.id || typeof body.active !== "boolean") {
      return NextResponse.json(
        { error: "Invalid task update." },
        { status: 400 }
      );
    }

    const result = await db(
      `UPDATE worker_tasks
       SET active = $1
       WHERE id = $2
         AND owner = $3
       RETURNING id, active`,
      [
        body.active,
        body.id,
        owner.toLowerCase(),
      ]
    );

    if (!result[0]) {
      return NextResponse.json(
        { error: "Task not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, task: result[0] });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update task.";

    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: message }, { status: 401 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const owner = authRequired(req);
    await initDb();

    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing task id." },
        { status: 400 }
      );
    }

    await db(
      `DELETE FROM worker_tasks
       WHERE id = $1 AND owner = $2`,
      [id, owner.toLowerCase()]
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to delete task.";

    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: message }, { status: 401 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}