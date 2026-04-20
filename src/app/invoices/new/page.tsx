"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/components/providers";
import { Panel } from "@/components/ui/panel";
import { Field, TextField, TextArea } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Client {
  id: string;
  name: string;
  email: string;
  company: string | null;
}

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
}

const CURRENCIES = [
  { code: "INR", symbol: "₹" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
];

export default function NewInvoicePage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [tax, setTax] = useState(0);
  const [items, setItems] = useState<LineItem[]>([{ description: "", quantity: 1, rate: 0 }]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetch("/api/clients")
        .then((r) => r.json())
        .then((d) => setClients(d.clients || []));
    }
  }, [user]);

  const addItem = () => setItems([...items, { description: "", quantity: 1, rate: 0 }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof LineItem, value: string | number) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: value };
    setItems(updated);
  };

  const subtotal = items.reduce((s, i) => s + i.quantity * i.rate, 0);
  const total = subtotal + tax;
  const currencySymbol = CURRENCIES.find((c) => c.code === currency)?.symbol ?? "";

  const fmt = (n: number) =>
    n.toLocaleString("en-IN", { style: "currency", currency, maximumFractionDigits: 2 });

  const handleSubmit = async (intent: "draft" | "send") => {
    if (!clientId) return toast.error("Pick a client first");
    if (!dueDate) return toast.error("Set a due date");
    if (items.some((i) => !i.description.trim())) return toast.error("Every line needs a description");
    if (items.some((i) => i.quantity <= 0 || i.rate <= 0))
      return toast.error("Quantity and rate must be positive");

    setSubmitting(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, dueDate, currency, notes, tax, items, intent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      if (data.warning) {
        toast.warning(data.warning);
      } else {
        toast.success(intent === "send" ? `${data.invoice.invoiceNumber} sent` : `${data.invoice.invoiceNumber} saved as draft`);
      }
      router.push(`/invoices/${data.invoice.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't create the invoice");
      setSubmitting(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="bg-[var(--color-paper)] min-h-screen">
      <div className="container mx-auto px-6 py-12 max-w-[1200px]">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/invoices"
            className="text-[13px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] inline-flex items-center gap-2"
          >
            ← Back to invoices
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSubmit("draft")}
              disabled={submitting}
              className="btn-ghost-ink h-10 px-4 text-sm rounded-[10px] inline-flex items-center gap-2 disabled:opacity-60"
            >
              Save as draft
            </button>
            <button
              onClick={() => handleSubmit("send")}
              disabled={submitting}
              className="btn-accent h-10 px-5 text-sm rounded-[10px] inline-flex items-center gap-2 disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Send to client
            </button>
          </div>
        </div>

        <div className="mb-10">
          <div className="eyebrow">New invoice · Composing</div>
          <h1 className="display-xl mt-2">A new <span className="italic-display">bill of work.</span></h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main composition area */}
          <div className="lg:col-span-2 space-y-5">

            {/* Header block */}
            <Panel className="p-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Bill to" required>
                  <Select value={clientId} onValueChange={setClientId}>
                    <SelectTrigger className="field !h-11 !w-full">
                      <SelectValue placeholder={clients.length ? "Select a client" : "Add a client first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}{c.company ? ` · ${c.company}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {clients.length === 0 && (
                    <Link href="/clients" className="mt-2 inline-block text-[12px] text-[var(--color-accent)] hover:underline">
                      → Add a client
                    </Link>
                  )}
                </Field>

                <Field label="Currency">
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="field !h-11 !w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.symbol} {c.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Due date" required className="sm:col-span-2">
                  <TextField
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </Field>
              </div>
            </Panel>

            {/* Line items */}
            <Panel className="p-7">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="eyebrow">Line items</div>
                  <div className="font-display text-[20px] mt-1">What you did</div>
                </div>
                <span className="text-[12px] text-[var(--color-ink-subtle)] font-mono">
                  {items.length} {items.length === 1 ? "line" : "lines"}
                </span>
              </div>

              {/* Header row */}
              <div className="hidden sm:grid grid-cols-12 gap-3 px-1 pb-2 eyebrow !text-[10px] border-b border-[var(--color-hairline)]">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-right">Qty</div>
                <div className="col-span-2 text-right">Rate</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>

              <div className="divide-y divide-[var(--color-hairline)]">
                {items.map((item, i) => (
                  <div key={i} className="grid grid-cols-12 gap-3 py-3 items-start sm:items-center">
                    <div className="col-span-12 sm:col-span-6">
                      <TextField
                        placeholder="e.g. Brand identity discovery workshop"
                        value={item.description}
                        onChange={(e) => updateItem(i, "description", e.target.value)}
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <TextField
                        type="number"
                        min={1}
                        step={1}
                        className="text-right"
                        value={item.quantity || ""}
                        onChange={(e) => updateItem(i, "quantity", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <TextField
                        type="number"
                        min={0}
                        step="0.01"
                        className="text-right"
                        value={item.rate || ""}
                        onChange={(e) => updateItem(i, "rate", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-3 sm:col-span-1 flex items-center font-mono text-[13px] tabular-nums justify-end">
                      {currencySymbol}{(item.quantity * item.rate).toFixed(2)}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      {items.length > 1 && (
                        <button
                          onClick={() => removeItem(i)}
                          className="w-8 h-8 rounded-md text-[var(--color-ink-subtle)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)]/60 flex items-center justify-center transition-colors"
                          aria-label="Remove line"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addItem}
                className="mt-4 inline-flex items-center gap-2 text-[13px] text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add line item
              </button>
            </Panel>

            {/* Notes */}
            <Panel className="p-7">
              <Field label="Notes" hint="Visible on the invoice">
                <TextArea
                  rows={3}
                  placeholder="Payment terms, thank-you note, additional context…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Field>
            </Panel>
          </div>

          {/* Live preview / totals */}
          <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <Panel className="p-7">
              <div className="eyebrow">Summary</div>

              <div className="mt-6 space-y-3">
                <Row label="Subtotal" value={fmt(subtotal)} />
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[var(--color-ink-muted)]">Tax</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[12px] text-[var(--color-ink-subtle)]">{currencySymbol}</span>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      className="w-24 h-8 px-2 text-right bg-transparent border border-[var(--color-hairline)] rounded-md font-mono text-[13px] tabular-nums focus:outline-none focus:border-[var(--color-ink)]"
                      value={tax || ""}
                      onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-[var(--color-hairline)]">
                <div className="eyebrow">Total due</div>
                <div className="numeral text-[44px] leading-none mt-2">
                  {currencySymbol}{total.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="mt-1 text-[12px] text-[var(--color-ink-subtle)] font-mono">{currency}</div>
              </div>
            </Panel>

            <Panel className="p-6 panel-deep">
              <div className="eyebrow !text-[var(--color-paper)]/60">A small reminder</div>
              <p className="mt-3 text-[14px] text-[var(--color-paper)] leading-relaxed">
                Drafts can be revisited any time. Sending it commits the bill — it&apos;ll arrive in the client&apos;s inbox.
              </p>
            </Panel>
          </div>
        </div>
      </div>
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
