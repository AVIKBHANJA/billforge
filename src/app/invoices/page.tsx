"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useUser } from "@/components/providers";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { TextField } from "@/components/ui/field";
import { Send, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

interface Invoice {
  id: string;
  invoiceNumber: string;
  total: number;
  currency: string;
  status: string;
  dueDate: string;
  createdAt: string;
  client: { name: string; email: string; company: string | null };
}

const STATUSES = ["ALL", "DRAFT", "SENT", "PAID", "OVERDUE"] as const;

const fmtMoney = (n: number, ccy = "INR") =>
  n.toLocaleString("en-IN", { style: "currency", currency: ccy, maximumFractionDigits: 0 });

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export default function InvoicesPage() {
  const { user, loading: authLoading } = useUser();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<(typeof STATUSES)[number]>("ALL");

  useEffect(() => {
    if (user) fetchInvoices();
  }, [user]);

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      setInvoices(data.invoices || []);
    } catch {
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const sendInvoice = async (id: string) => {
    try {
      const res = await fetch(`/api/invoices/${id}/send`, { method: "POST" });
      if (!res.ok) throw new Error();
      toast.success("Invoice sent");
      fetchInvoices();
    } catch {
      toast.error("Couldn't send the invoice");
    }
  };

  const deleteInvoice = async (id: string) => {
    if (!confirm("Delete this invoice? This cannot be undone.")) return;
    try {
      await fetch(`/api/invoices/${id}`, { method: "DELETE" });
      setInvoices((prev) => prev.filter((i) => i.id !== id));
      toast.success("Invoice deleted");
    } catch {
      toast.error("Couldn't delete");
    }
  };

  const filtered = useMemo(() => {
    return invoices.filter((i) => {
      if (filter !== "ALL" && i.status !== filter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        i.invoiceNumber.toLowerCase().includes(q) ||
        i.client.name.toLowerCase().includes(q) ||
        (i.client.company?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [invoices, filter, search]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { ALL: invoices.length };
    for (const inv of invoices) c[inv.status] = (c[inv.status] || 0) + 1;
    return c;
  }, [invoices]);

  if (authLoading) return null;

  return (
    <div className="bg-[var(--color-paper)] min-h-screen">
      <div className="container mx-auto px-6 py-12 max-w-[1200px]">
        <PageHeader
          eyebrow="Ledger"
          title={<>Invoices</>}
          description="Every bill you've ever sent, in order of recency."
          actions={
            <Link href="/invoices/new" className="btn-accent h-11 px-5 text-sm rounded-[10px] inline-flex items-center gap-2">
              + New invoice
            </Link>
          }
        />

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-ink-subtle)]" />
            <TextField
              placeholder="Search invoice number, client, company…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-1 p-1 bg-[var(--color-paper-soft)] border border-[var(--color-hairline)] rounded-[10px]">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3.5 h-[34px] text-[13px] rounded-md transition-colors flex items-center gap-1.5 ${
                  filter === s
                    ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                    : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                }`}
              >
                {s.charAt(0) + s.slice(1).toLowerCase()}
                {counts[s] !== undefined && counts[s] > 0 && (
                  <span className={`text-[10px] tabular-nums ${filter === s ? "opacity-70" : "opacity-60"}`}>
                    {counts[s]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <Panel className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-14 skeleton" />)}
          </Panel>
        ) : filtered.length === 0 ? (
          <EmptyState
            title={search || filter !== "ALL" ? "No matches" : "No invoices yet"}
            description={search || filter !== "ALL" ? "Try a different filter." : "Compose your first invoice."}
            action={
              !search && filter === "ALL" ? (
                <Link href="/invoices/new" className="btn-accent h-10 px-4 text-sm rounded-[10px] inline-flex items-center gap-2">
                  Compose invoice
                </Link>
              ) : undefined
            }
          />
        ) : (
          <Panel className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <Th>Invoice</Th>
                  <Th>Client</Th>
                  <Th className="text-right">Amount</Th>
                  <Th className="hidden md:table-cell">Issued</Th>
                  <Th className="hidden md:table-cell">Due</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-t border-[var(--color-hairline)] hover:bg-[var(--color-paper-deep)]/40 transition-colors group"
                  >
                    <Td>
                      <Link
                        href={`/invoices/${inv.id}`}
                        className="font-mono text-[13px] text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors"
                      >
                        {inv.invoiceNumber}
                      </Link>
                    </Td>
                    <Td>
                      <div className="text-[14px]">{inv.client.name}</div>
                      {inv.client.company && (
                        <div className="text-[12px] text-[var(--color-ink-subtle)]">{inv.client.company}</div>
                      )}
                    </Td>
                    <Td className="text-right font-mono tabular-nums text-[14px]">
                      {fmtMoney(inv.total, inv.currency)}
                    </Td>
                    <Td className="hidden md:table-cell text-[13px] text-[var(--color-ink-muted)] tabular-nums">
                      {fmtDate(inv.createdAt)}
                    </Td>
                    <Td className="hidden md:table-cell text-[13px] text-[var(--color-ink-muted)] tabular-nums">
                      {fmtDate(inv.dueDate)}
                    </Td>
                    <Td>
                      <StatusBadge status={inv.status} />
                    </Td>
                    <Td>
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {inv.status === "DRAFT" && (
                          <button
                            onClick={() => sendInvoice(inv.id)}
                            className="w-8 h-8 rounded-md text-[var(--color-ink-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] flex items-center justify-center transition-colors"
                            aria-label="Send invoice"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteInvoice(inv.id)}
                          className="w-8 h-8 rounded-md text-[var(--color-ink-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)]/60 flex items-center justify-center transition-colors"
                          aria-label="Delete invoice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        )}
      </div>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-6 py-3 eyebrow !text-[10px] font-medium bg-[var(--color-paper-deep)]/40 ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-6 py-4 ${className}`}>{children}</td>;
}
