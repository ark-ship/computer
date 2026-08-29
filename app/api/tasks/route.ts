import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { ethers } from "ethers";

import { authRequired } from "@/lib/auth";
import { assertHolder } from "@/lib/ownership";
import { db, initDb } from "@/lib/db";
import {
  addAlchemyContract,
} from "@/lib/alchemy";

import { getCollectionContract } from "@/lib/opensea";

const TASK_TYPES = new Set([
  "wallet",
  "floor",
  "mint",
]);

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ==========================================================
   VALIDATE COLLECTION SLUG
========================================================== */

function isValidCollectionSlug(
  value: string
): boolean {
  return /^[a-zA-Z0-9][a-zA-Z0-9-_]*$/.test(
    value
  );
}

/* ==========================================================
   POST - CREATE TASK
========================================================== */

export async function POST(
  req: NextRequest
) {
  try {
    const owner =
      authRequired(req);

    await assertHolder(owner);
    await initDb();

    const body =
      (await req.json()) as {
        type?: string;
        target?: string;
        condition?: string;
      };

    const type =
      body.type?.trim();

    const target =
      body.target?.trim();

    const condition =
      body.condition?.trim();

    /* --------------------------------------------------------
       BASIC VALIDATION
    -------------------------------------------------------- */

    if (
      !type ||
      !TASK_TYPES.has(type)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid task type.",
        },
        { status: 400 }
      );
    }

    if (
      !target ||
      target.length > 180
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid target.",
        },
        { status: 400 }
      );
    }

    if (
      !condition ||
      condition.length > 180
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid condition.",
        },
        { status: 400 }
      );
    }

    /* --------------------------------------------------------
       WALLET TASK
    -------------------------------------------------------- */

    if (
      type === "wallet" &&
      !ethers.isAddress(target)
    ) {
      return NextResponse.json(
        {
          error:
            "Wallet Watcher target must be a valid EVM address.",
        },
        { status: 400 }
      );
    }

    /* --------------------------------------------------------
       COLLECTION TASKS
    -------------------------------------------------------- */

    let contractAddress:
      | string
      | null = null;

    if (
      type === "floor" ||
      type === "mint"
    ) {
      /*
       * Collection target must be an OpenSea slug.
       *
       * Example:
       * super-computers
       * azuki
       * pudgy-penguins
       */
      if (
        !isValidCollectionSlug(
          target
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Collection target must be a valid OpenSea slug.",
          },
          { status: 400 }
        );
      }
    }

    /* --------------------------------------------------------
       MINT = RESOLVE CONTRACT
    -------------------------------------------------------- */

    if (type === "mint") {
      try {
        contractAddress =
          await getCollectionContract(
            target
          );
      } catch (error) {
        console.error(
          "OpenSea collection lookup failed:",
          error
        );

        return NextResponse.json(
          {
            error:
              "Unable to find this OpenSea collection.",
          },
          { status: 400 }
        );
      }

      if (
        !contractAddress ||
        !ethers.isAddress(
          contractAddress
        )
      ) {
        return NextResponse.json(
          {
            error:
              "No contract address found for this OpenSea collection.",
          },
          { status: 400 }
        );
      }

      contractAddress =
        ethers.getAddress(
          contractAddress
        );
        try {
  await addAlchemyContract(
    contractAddress
  );
} catch (error) {
  console.error(
    "Alchemy contract registration failed:",
    error
  );

  return NextResponse.json(
    {
      error:
        "Collection found, but realtime monitoring could not be registered.",
    },
    { status: 500 }
  );
}
    }

    /* --------------------------------------------------------
       CREATE TASK
    -------------------------------------------------------- */

    const id =
      crypto.randomUUID();

    const result =
      await db<{
        id: string;
        owner: string;
        type: string;
        target: string;
        condition: string;
        contract_address:
          | string
          | null;
        active: boolean;
        last_checked_at:
          | string
          | null;
        last_triggered_at:
          | string
          | null;
        created_at: string;
      }>(
        `
        INSERT INTO worker_tasks
          (
            id,
            owner,
            type,
            target,
            condition,
            contract_address
          )
        VALUES
          (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6
          )
        RETURNING
          id,
          owner,
          type,
          target,
          condition,
          contract_address,
          active,
          last_checked_at,
          last_triggered_at,
          created_at
        `,
        [
          id,
          owner.toLowerCase(),
          type,
          target,
          condition,
          contractAddress,
        ]
      );

    const task =
      result[0];

    return NextResponse.json({
      ok: true,

      task: {
        id: task.id,
        type: task.type,
        target: task.target,
        condition:
          task.condition,
        contract_address:
          task.contract_address,
        active: task.active,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to create task.";

    if (
      message === "UNAUTHORIZED" ||
      message ===
        "WALLET_DOES_NOT_OWN_COMPUTER"
    ) {
      return NextResponse.json(
        { error: message },
        { status: 401 }
      );
    }

    console.error(
      "Create task failed:",
      error
    );

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    );
  }
}

/* ==========================================================
   PATCH - TOGGLE TASK
========================================================== */

export async function PATCH(
  req: NextRequest
) {
  try {
    const owner =
      authRequired(req);

    await initDb();

    const body =
      (await req.json()) as {
        id?: string;
        active?: boolean;
      };

    if (
      !body.id ||
      typeof body.active !==
        "boolean"
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid task update.",
        },
        { status: 400 }
      );
    }

    const result =
      await db<{
        id: string;
        active: boolean;
      }>(
        `
        UPDATE worker_tasks
        SET active = $1
        WHERE id = $2
          AND LOWER(owner) = LOWER($3)
        RETURNING id, active
        `,
        [
          body.active,
          body.id,
          owner.toLowerCase(),
        ]
      );

    if (!result[0]) {
      return NextResponse.json(
        {
          error:
            "Task not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      task: result[0],
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to update task.";

    if (
      message === "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          error: message,
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    );
  }
}

/* ==========================================================
   DELETE - REMOVE TASK
========================================================== */

export async function DELETE(
  req: NextRequest
) {
  try {
    const owner =
      authRequired(req);

    await initDb();

    const id =
      req.nextUrl.searchParams.get(
        "id"
      );

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Missing task id.",
        },
        { status: 400 }
      );
    }

    const result =
      await db<{
        id: string;
      }>(
        `
        DELETE FROM worker_tasks
        WHERE id = $1
          AND LOWER(owner) = LOWER($2)
        RETURNING id
        `,
        [
          id,
          owner.toLowerCase(),
        ]
      );

    if (!result[0]) {
      return NextResponse.json(
        {
          error:
            "Task not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to delete task.";

    if (
      message === "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          error: message,
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    );
  }
}