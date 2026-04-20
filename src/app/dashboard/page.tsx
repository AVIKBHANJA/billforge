"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/components/providers";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatCard } from "@/components/ui/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "sonner";

interface Invoice {
  id: string;
  invoiceNumber: string;
  total: number;
  currency: string;
  status: string;
  dueDate: string;
  createdAt: string;
  client: { name: string; company: string | null };
}

const fmtMoney = (n: number, ccy = "INR") =>
  n.toLocaleString("en-IN", { style: "currency", currency: ccy, maximumFractionDigits: 0 });

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

export default function DashboardPage() {
  const { user, loading: authLoading } = useUser();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch("/api/invoices")
        .then((r) => r.json())
        .then((d) => setInvoices(d.invoices || []))
        .catch(() => toast.error("Failed to load data"))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading) return null;

  const paid = invoices.filter((i) => i.status === "PAID");
  const outstanding = invoices.filter((i) => ["SENT", "VIEWED"].includes(i.status));
  const overdue = invoices.filter((i) => i.status === "OVERDUE");
  const totalRevenue = paid.reduce((s, i) => s + i.total, 0);
  const totalOutstanding = outstanding.reduce((s, i) => s + i.total, 0);
  const recent = invoices.slice(0, 6);
  const fullName =
    (user?.user_metadata?.name as string | undefined) ?? user?.email?.split("@")[0] ?? "there";
  const firstName = fullName.split(" ")[0];

  return (
    <div className="bg-[var(--color-paper)] min-h-screen">
      <div className="container mx-auto px-6 py-12 max-w-[1200px]">
        <PageHeader
          eyebrow={`Today · ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long" })}`}
          title={
            <>
              Good to see you, <span className="italic-display">{firstName}.</span>
            </>
          }
          description="Here's where the books stand this morning."
          actions={
            <Link href="/invoices/new" className="btn-accent h-11 px-5 text-sm rounded-[10px] inline-flex items-center gap-2">
              + New invoice
            </Link>
          }
        />

        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12 animate-rise">
          <StatCard
            accent
            label="Revenue · paid"
            value={fmtMoney(totalRevenue)}
            hint={`${paid.length} invoices settled`}
          />
          <StatCard
            label="Outstanding"
            value={fmtMoney(totalOutstanding)}
            hint={`${outstanding.length} awaiting payment`}
          />
          <StatCard
            label="Overdue"
            value={overdue.length}
            hint={overdue.length === 0 ? "All clear ✦" : "Needs follow-up"}
          />
          <StatCard
            label="All invoices"
            value={invoices.length}
            hint="Across all clients"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Recent invoices — wide */}
          <Panel className="lg:col-span-2 overflow-hidden">
            <div className="px-6 py-5 flex items-center justify-between border-b border-[var(--color-hairline)]">
              <div>
                <div className="eyebrow">Recent invoices</div>
                <div className="font-display text-[20px] mt-1">Latest activity</div>
              </div>
              <Link
                href="/invoices"
                className="text-[13px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
              >
                View all →
              </Link>
            </div>

            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => <div key={i} className="h-12 skeleton" />)}
              </div>
            ) : recent.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  title="No invoices yet"
                  description="Compose your first one — it takes about a minute."
                  action={
                    <Link href="/invoices/new" className="btn-accent h-10 px-4 text-sm rounded-[10px] inline-flex items-center gap-2">
                      Compose invoice
                    </Link>
                  }
                />
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <Th>Invoice</Th>
                    <Th className="hidden sm:table-cell">Client</Th>
                    <Th className="text-right">Amount</Th>
                    <Th className="hidden md:table-cell">Due</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((inv) => (
                    <tr
                      key={inv.id}
                      className="border-t border-[var(--color-hairline)] hover:bg-[var(--color-paper-deep)]/40 transition-colors"
                    >
                      <Td>
                        <Link
                          href={`/invoices/${inv.id}`}
                          className="font-mono text-[13px] text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors"
                        >
                          {inv.invoiceNumber}
                        </Link>
                      </Td>
                      <Td className="hidden sm:table-cell">
                        <div className="text-[14px]">{inv.client.name}</div>
                        {inv.client.company && (
                          <div className="text-[12px] text-[var(--color-ink-subtle)]">{inv.client.company}</div>
                        )}
                      </Td>
                      <Td className="text-right font-mono tabular-nums text-[14px]">
                        {fmtMoney(inv.total, inv.currency)}
                      </Td>
                      <Td className="hidden md:table-cell text-[13px] text-[var(--color-ink-muted)] tabular-nums">
                        {fmtDate(inv.dueDate)}
                      </Td>
                      <Td>
                        <StatusBadge status={inv.status} />
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Panel>

          {/* Side column */}
          <div className="space-y-5">
            <Panel className="p-6">
              <div className="eyebrow">Quick actions</div>
              <div className="mt-4 space-y-2">
                <QuickLink href="/invoices/new" label="Compose invoice" hint="From scratch or template" />
                <QuickLink href="/clients" label="Add client" hint="Names, addresses, notes" />
                <QuickLink href="/time" label="Log time" hint="Start the timer" />
              </div>
            </Panel>

            <Panel className="p-6 panel-deep">
              <div className="eyebrow !text-[var(--color-paper)]/60">Tip of the day</div>
              <p className="mt-3 font-display text-[20px] leading-snug">
                Send invoices on Tuesday morning. Studies show they get paid 14% faster.
              </p>
              <div className="mt-4 font-mono text-[10px] text-[var(--color-paper)]/50 uppercase tracking-widest">
                — From the BillForge field notes
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-6 py-3 eyebrow !text-[10px] font-medium ${className}`}>{children}</th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-6 py-4 ${className}`}>{children}</td>;
}

function QuickLink({ href, label, hint }: { href: string; label: string; hint: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--color-paper-deep)]/50 transition-colors group"
    >
      <div>
        <div className="text-[14px] font-medium text-[var(--color-ink)]">{label}</div>
        <div className="text-[12px] text-[var(--color-ink-subtle)]">{hint}</div>
      </div>
      <span className="text-[var(--color-ink-subtle)] group-hover:text-[var(--color-accent)] transition-colors">→</span>
    </Link>
  );
}
