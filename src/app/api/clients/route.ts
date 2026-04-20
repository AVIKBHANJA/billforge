import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { ClientCreateSchema, zodErrorMessage } from "@/lib/validators";
import { prismaErrorResponse } from "@/lib/prisma-errors";

export async function GET() {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  try {
    const clients = await prisma.client.findMany({
      where: { userId: auth.user.id },
      include: {
        invoices: { select: { total: true, status: true } },
        _count: { select: { invoices: true, projects: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ clients });
  } catch (err) {
    return prismaErrorResponse(err, "clients.list") ?? NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = ClientCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: zodErrorMessage(parsed.error) }, { status: 400 });
  }

  try {
    const client = await prisma.client.create({
      data: { userId: auth.user.id, ...parsed.data },
    });
    return NextResponse.json({ client });
  } catch (err) {
    return prismaErrorResponse(err, "client.create") ?? NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
