import { NextResponse } from "next/server";

type PrismaLikeError = {
  code?: string;
  message?: string;
  meta?: { target?: string[] | string };
};

/**
 * Map a thrown Prisma (or driver) error into a user-friendly NextResponse.
 * Returns null if the error isn't recognised — callers fall back to a generic 500.
 */
export function prismaErrorResponse(err: unknown, context: string): NextResponse | null {
  const e = err as PrismaLikeError;
  const code = e.code;
  const msg = e.message ?? "";

  // Connection problems (DB down, wrong DATABASE_URL, network)
  if (
    code === "P1000" || // auth failed
    code === "P1001" || // can't reach
    code === "P1002" || // timed out
    code === "P1017" || // server closed conn
    msg.includes("ECONNREFUSED") ||
    msg.includes("ETIMEDOUT") ||
    msg.includes("ENOTFOUND")
  ) {
    return NextResponse.json(
      { error: "Can't reach the database right now. Try again in a moment." },
      { status: 503 }
    );
  }

  // Unique constraint violation
  if (code === "P2002") {
    const target = Array.isArray(e.meta?.target) ? e.meta!.target!.join(", ") : e.meta?.target;
    if (target?.toString().toLowerCase().includes("email")) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: `That ${target ?? "value"} is already taken.` },
      { status: 409 }
    );
  }

  // Foreign key violation
  if (code === "P2003") {
    return NextResponse.json(
      { error: "Referenced record doesn't exist." },
      { status: 400 }
    );
  }

  // Record not found
  if (code === "P2025") {
    return NextResponse.json({ error: "Record not found." }, { status: 404 });
  }

  // Schema / migration mismatch — caller should know
  if (code === "P2021" || code === "P2022") {
    console.error(`schema_mismatch[${context}]`, err);
    return NextResponse.json(
      { error: "Database schema is out of sync. Run migrations." },
      { status: 500 }
    );
  }

  return null;
}
