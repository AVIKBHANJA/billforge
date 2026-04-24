import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "./supabase/server";
import { prisma } from "./prisma";
import { prismaErrorResponse } from "./prisma-errors";

export type AuthedUser = {
  id: string;
  email: string;
  name: string | null;
};

/**
 * Resolve the Supabase session and ensure a Prisma `User` row exists for them.
 * Returns either the user or a NextResponse (401 unauthorized / 503 db down) to be returned directly.
 */
export async function requireUser(): Promise<
  { user: AuthedUser; error?: never } | { user?: never; error: NextResponse }
> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user: sbUser },
  } = await supabase.auth.getUser();

  if (!sbUser?.id || !sbUser.email) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const name =
    (sbUser.user_metadata?.name as string | undefined) ??
    (sbUser.user_metadata?.full_name as string | undefined) ??
    null;

  try {
    const dbUser = await prisma.user.upsert({
      where: { id: sbUser.id },
      update: { email: sbUser.email, ...(name !== null && { name }) },
      create: { id: sbUser.id, email: sbUser.email, name },
      select: { id: true, email: true, name: true },
    });
    return { user: dbUser };
  } catch (err) {
    console.error("requireUser_upsert_failed", err);
    const mapped = prismaErrorResponse(err, "auth.upsert-user");
    return {
      error:
        mapped ??
        NextResponse.json(
          { error: "Could not load your account. Try again in a moment." },
          { status: 500 }
        ),
    };
  }
}
