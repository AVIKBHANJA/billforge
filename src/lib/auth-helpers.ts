import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "./supabase/server";
import { prisma } from "./prisma";

export type AuthedUser = {
  id: string;
  email: string;
  name: string | null;
};

/**
 * Resolve the Supabase session and ensure a Prisma `User` row exists for them.
 * Returns either the user or a 401 NextResponse to be returned directly.
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

  // Upsert keeps Prisma User in sync with Supabase auth user.
  // The Prisma `id` is the Supabase auth UUID.
  const name =
    (sbUser.user_metadata?.name as string | undefined) ??
    (sbUser.user_metadata?.full_name as string | undefined) ??
    null;

  const dbUser = await prisma.user.upsert({
    where: { id: sbUser.id },
    update: { email: sbUser.email, ...(name !== null && { name }) },
    create: { id: sbUser.id, email: sbUser.email, name },
    select: { id: true, email: true, name: true },
  });

  return { user: dbUser };
}
