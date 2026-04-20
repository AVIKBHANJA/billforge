import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { InvoiceCreateSchema, zodErrorMessage } from "@/lib/validators";
import { sendInvoiceEmail } from "@/lib/email";
import { prismaErrorResponse } from "@/lib/prisma-errors";

export async function GET() {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  try {
    const invoices = await prisma.invoice.findMany({
      where: { userId: auth.user.id },
      include: {
        client: { select: { name: true, email: true, company: true } },
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ invoices });
  } catch (err) {
    return prismaErrorResponse(err, "invoices.list") ?? NextResponse.json({ error: "Failed to load invoices" }, { status: 500 });
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

  const parsed = InvoiceCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: zodErrorMessage(parsed.error) }, { status: 400 });
  }

  const { clientId, projectId, dueDate, currency, notes, items, tax, intent } = parsed.data;

  const client = await prisma.client.findFirst({
    where: { id: clientId, userId: auth.user.id },
    select: { id: true },
  });
  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const total = subtotal + tax;

  const buildInvoice = async () => {
    const count = await prisma.invoice.count({ where: { userId: auth.user.id } });
    const invoiceNumber = `INV-${String(count + 1).padStart(4, "0")}`;
    return prisma.invoice.create({
      data: {
        userId: auth.user.id,
        clientId,
        projectId: projectId || null,
        invoiceNumber,
        status: intent === "send" ? "SENT" : "DRAFT",
        dueDate: new Date(dueDate),
        subtotal,
        tax,
        total,
        currency,
        notes: notes ?? null,
        items: {
          create: items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.quantity * item.rate,
          })),
        },
      },
      include: { items: true, client: true },
    });
  };

  let invoice;
  try {
    try {
      invoice = await buildInvoice();
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === "P2002") {
        invoice = await buildInvoice();
      } else {
        throw err;
      }
    }
  } catch (err) {
    console.error("invoice_create_failed", err);
    return prismaErrorResponse(err, "invoice.create") ?? NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }

  if (intent === "send") {
    try {
      await sendInvoiceEmail({
        to: invoice.client.email,
        invoiceNumber: invoice.invoiceNumber,
        amount: invoice.total,
        currency: invoice.currency,
        dueDate: invoice.dueDate.toLocaleDateString(),
        paymentLink: invoice.paymentLink || undefined,
        fromName: auth.user.name || "Freelancer",
      });
    } catch (err) {
      console.error("send_on_create_failed", { invoiceId: invoice.id, err });
      await prisma.invoice.update({ where: { id: invoice.id }, data: { status: "DRAFT" } });
      return NextResponse.json(
        { invoice: { ...invoice, status: "DRAFT" }, warning: "Invoice saved as draft — email failed to send." },
        { status: 200 }
      );
    }
  }

  return NextResponse.json({ invoice });
}
