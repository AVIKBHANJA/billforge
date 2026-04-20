import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { sendInvoiceEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  const rl = rateLimit(`send:${auth.user.id}`, { max: 10, windowMs: 60 * 1000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Slow down — too many sends. Try again in a moment." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
    );
  }

  const { id } = await params;

  const invoice = await prisma.invoice.findFirst({
    where: { id, userId: auth.user.id },
    include: { client: true },
  });

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  if (invoice.status === "SENT" || invoice.status === "VIEWED") {
    const elapsed = Date.now() - new Date(invoice.updatedAt).getTime();
    if (elapsed < 60_000) {
      return NextResponse.json(
        { error: "This invoice was just sent. Wait a minute before re-sending." },
        { status: 409 }
      );
    }
  }

  if (invoice.status === "PAID" || invoice.status === "CANCELLED") {
    return NextResponse.json(
      { error: `Cannot send a ${invoice.status.toLowerCase()} invoice` },
      { status: 409 }
    );
  }

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
    console.error("send_invoice_failed", { invoiceId: id, err });
    return NextResponse.json(
      { error: "Email service rejected the message. Try again shortly." },
      { status: 502 }
    );
  }

  await prisma.invoice.update({
    where: { id },
    data: { status: "SENT" },
  });

  return NextResponse.json({ success: true });
}
