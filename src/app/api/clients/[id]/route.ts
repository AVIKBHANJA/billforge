import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { ClientUpdateSchema, zodErrorMessage } from "@/lib/validators";
import { prismaErrorResponse } from "@/lib/prisma-errors";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  const { id } = await params;
  try {
    const client = await prisma.client.findFirst({
      where: { id, userId: auth.user.id },
      include: {
        invoices: { orderBy: { createdAt: "desc" } },
        projects: true,
      },
    });
    if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });
    return NextResponse.json({ client });
  } catch (err) {
    return prismaErrorResponse(err, "client.get") ?? NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = ClientUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: zodErrorMessage(parsed.error) }, { status: 400 });
  }

  try {
    const result = await prisma.client.updateMany({
      where: { id, userId: auth.user.id },
      data: parsed.data,
    });
    if (result.count === 0) return NextResponse.json({ error: "Client not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return prismaErrorResponse(err, "client.update") ?? NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  const { id } = await params;
  try {
    const result = await prisma.client.deleteMany({
      where: { id, userId: auth.user.id },
    });
    if (result.count === 0) return NextResponse.json({ error: "Client not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return prismaErrorResponse(err, "client.delete") ?? NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
