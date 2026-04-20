import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { InvoiceUpdateSchema, zodErrorMessage } from "@/lib/validators";
import { prismaErrorResponse } from "@/lib/prisma-errors";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  const { id } = await params;
  try {
    const invoice = await prisma.invoice.findFirst({
      where: { id, userId: auth.user.id },
      include: { items: true, client: true, project: true },
    });
    if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    return NextResponse.json({ invoice });
  } catch (err) {
    return prismaErrorResponse(err, "invoice.get") ?? NextResponse.json({ error: "Failed" }, { status: 500 });
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

  const parsed = InvoiceUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: zodErrorMessage(parsed.error) }, { status: 400 });
  }

  try {
    const invoice = await prisma.invoice.findFirst({
      where: { id, userId: auth.user.id },
      select: { id: true, status: true, paidAt: true },
    });
    if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

    const data: Parameters<typeof prisma.invoice.update>[0]["data"] = {};
    if (parsed.data.status !== undefined) {
      data.status = parsed.data.status;
      if (parsed.data.status === "PAID" && invoice.status !== "PAID") {
        data.paidAt = new Date();
      } else if (parsed.data.status !== "PAID") {
        data.paidAt = null;
      }
    }
    if (parsed.data.notes !== undefined) data.notes = parsed.data.notes;

    const updated = await prisma.invoice.update({
      where: { id },
      data,
      include: { items: true, client: true },
    });
    return NextResponse.json({ invoice: updated });
  } catch (err) {
    return prismaErrorResponse(err, "invoice.update") ?? NextResponse.json({ error: "Failed" }, { status: 500 });
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
    const result = await prisma.invoice.deleteMany({
      where: { id, userId: auth.user.id },
    });
    if (result.count === 0) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return prismaErrorResponse(err, "invoice.delete") ?? NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
