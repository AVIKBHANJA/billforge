"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/components/providers";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { Send, Loader2, Printer, Check } from "lucide-react";
import { toast } from "sonner";

interface InvoiceDetail {
  id: string;
  invoiceNumber: string;
  total: number;
  subtotal: number;
  currency: string;
  status: string;
  issueDate: string;
  dueDate: string;
  createdAt: string;
  notes: string | null;
  tax: number;
  client: { name: string; email: string; company: string | null; phone: string | null; address: string | null };
  items: { id: string; description: string; quantity: number; rate: number; amount: number }[];
}

export default function InvoiceDetailPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const params = useParams();
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    if (user && params.id) fetchInvoice();
  }, [user, params.id]);

  const fetchInvoice = async () => {
    try {
      const res = await fetch(`/api/invoices/${params.id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setInvoice(data.invoice);
    } catch {
      toast.error("Failed to load invoice");
      router.push("/invoices");
    } finally {
      setLoading(false);
    }
  };

  const sendInvoice = async () => {
    setSending(true);
    try {
      const res = await fetch(`/api/invoices/${params.id}/send`, { method: "POST" });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Send failed");
      }
      toast.success("Invoice sent");
      fetchInvoice();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't send");
    } finally {
      setSending(false);
    }
  };

  const markPaid = async () => {
    setMarking(true);
    try {
      const res = await fetch(`/api/invoices/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAID" }),
      });
      if (!res.ok) throw new Error();
      toast.success("Marked paid");
      fetchInvoice();
    } catch {
      toast.error("Couldn't update");
    } finally {
      setMarking(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[var(--color-paper)] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--color-ink-subtle)]" />
      </div>
    );
  }

  if (!invoice) return null;

  const fmt = (n: number) =>
    n.toLocaleString("en-IN", {
      style: "currency",
      currency: invoice.currency,
      maximumFractionDigits: 2,
    });

  const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="bg-[var(--color-paper)] min-h-screen">
      <div className="container mx-auto px-6 py-12 max-w-[1200px]">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-10 print:hidden">
          <Link
            href="/invoices"
            className="text-[13px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] inline-flex items-center gap-2"
          >
            ← Back to invoices
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="btn-ghost-ink h-10 px-4 text-sm rounded-[10px] inline-flex items-center gap-2"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            {invoice.status === "DRAFT" && (
              <button
                onClick={sendInvoice}
                disabled={sending}
                className="btn-accent h-10 px-5 text-sm rounded-[10px] inline-flex items-center gap-2 disabled:opacity-60"
              >
                {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Send invoice
              </button>
            )}
            {(invoice.status === "SENT" || invoice.status === "VIEWED" || invoice.status === "OVERDUE") && (
              <button
                onClick={markPaid}
                disabled={marking}
                className="btn-ink h-10 px-5 text-sm rounded-[10px] inline-flex items-center gap-2 disabled:opacity-60"
              >
                {marking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                Mark paid
              </button>
            )}
          </div>
        </div>

        {/* Invoice document */}
        <Panel className="p-10 lg:p-14 relative overflow-hidden">
          {invoice.status === "PAID" && (
            <div className="absolute top-10 right-10 print:hidden">
              <div className="border-2 border-[var(--color-success)] text-[var(--color-success)] px-4 py-1.5 rounded font-display text-[18px] uppercase tracking-widest -rotate-12 opacity-90">
                Paid
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex items-start justify-between pb-8 border-b border-[var(--color-hairline)]">
            <div>
              <div className="eyebrow">Invoice</div>
              <div className="font-display text-[44px] leading-none mt-2 text-[var(--color-ink)]">
                {invoice.invoiceNumber}
              </div>
              <div className="mt-3"><StatusBadge status={invoice.status} /></div>
            </div>
            <div className="text-right">
              <div className="font-display text-[24px] leading-none">
                Bill<span className="italic-display text-[var(--color-accent)]">forge</span>
              </div>
              <div className="text-[12px] text-[var(--color-ink-muted)] mt-2">
                Composed by {(user?.user_metadata?.name as string) ?? user?.email ?? "—"}
              </div>
            </div>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-b border-[var(--color-hairline)]">
            <div>
              <div className="eyebrow !text-[10px]">Billed to</div>
              <div className="mt-2 font-medium text-[15px]">{invoice.client.name}</div>
              {invoice.client.company && (
                <div className="text-[13px] text-[var(--color-ink-muted)]">{invoice.client.company}</div>
              )}
              <div className="text-[13px] text-[var(--color-ink-muted)] mt-1">{invoice.client.email}</div>
              {invoice.client.phone && (
                <div className="text-[13px] text-[var(--color-ink-muted)]">{invoice.client.phone}</div>
              )}
            </div>
            <div>
              <div className="eyebrow !text-[10px]">Issued</div>
              <div className="mt-2 text-[14px] tabular-nums">{fmtDate(invoice.issueDate || invoice.createdAt)}</div>
            </div>
            <div>
              <div className="eyebrow !text-[10px]">Due</div>
              <div className="mt-2 text-[14px] tabular-nums">{fmtDate(invoice.dueDate)}</div>
            </div>
            <div>
              <div className="eyebrow !text-[10px]">Currency</div>
              <div className="mt-2 text-[14px] font-mono">{invoice.currency}</div>
            </div>
          </div>

          {/* Items table */}
          <div className="py-8">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-hairline)]">
                  <th className="text-left py-3 eyebrow !text-[10px] font-medium">Description</th>
                  <th className="text-right py-3 eyebrow !text-[10px] font-medium">Qty</th>
                  <th className="text-right py-3 eyebrow !text-[10px] font-medium">Rate</th>
                  <th className="text-right py-3 eyebrow !text-[10px] font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id} className="border-b border-[var(--color-hairline)] last:border-0">
                    <td className="py-4 text-[14px] text-[var(--color-ink)]">{item.description}</td>
                    <td className="py-4 text-right text-[14px] text-[var(--color-ink-muted)] tabular-nums">{item.quantity}</td>
                    <td className="py-4 text-right text-[14px] text-[var(--color-ink-muted)] font-mono tabular-nums">{fmt(item.rate)}</td>
                    <td className="py-4 text-right text-[14px] font-mono tabular-nums">{fmt(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2.5">
              <Row label="Subtotal" value={fmt(invoice.subtotal)} />
              {invoice.tax > 0 && <Row label="Tax" value={fmt(invoice.tax)} />}
              <div className="pt-3 mt-3 border-t border-[var(--color-hairline)]">
                <div className="flex items-baseline justify-between">
                  <span className="eyebrow">Total due</span>
                  <span className="numeral text-[36px] leading-none">{fmt(invoice.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mt-10 pt-8 border-t border-dashed border-[var(--color-hairline-strong)]">
              <div className="eyebrow !text-[10px] mb-2">Notes</div>
              <p className="text-[14px] text-[var(--color-ink-2)] whitespace-pre-wrap leading-relaxed max-w-xl">
                {invoice.notes}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-[var(--color-hairline)] flex items-center justify-between text-[11px] text-[var(--color-ink-subtle)]">
            <span>Composed in BillForge · billforge.app</span>
            <span className="font-mono">{invoice.invoiceNumber} · {invoice.currency} · {fmtDate(invoice.createdAt)}</span>
          </div>
        </Panel>
      </div>

      <style jsx global>{`
        @media print {
          nav, .print\\:hidden { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className="text-[var(--color-ink-muted)]">{label}</span>
      <span className="font-mono tabular-nums text-[var(--color-ink)]">{value}</span>
    </div>
  );
}
