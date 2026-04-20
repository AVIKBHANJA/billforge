"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/components/providers";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, TextField } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Mail, Phone, Trash2, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Client {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  _count: { invoices: number; projects: number };
  invoices: { total: number; status: string }[];
}

const fmtMoney = (n: number, ccy = "INR") =>
  n.toLocaleString("en-IN", { style: "currency", currency: ccy, maximumFractionDigits: 0 });

export default function ClientsPage() {
  const { user, loading: authLoading } = useUser();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "" });

  useEffect(() => {
    if (user) fetchClients();
  }, [user]);

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      setClients(data.clients || []);
    } catch {
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  const createClient = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      return toast.error("Name and email are required");
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed");
      }
      toast.success("Client added");
      setOpen(false);
      setForm({ name: "", email: "", company: "", phone: "" });
      fetchClients();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't add client");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteClient = async (id: string) => {
    if (!confirm("Remove this client? Their invoices will go too.")) return;
    try {
      await fetch(`/api/clients/${id}`, { method: "DELETE" });
      setClients((prev) => prev.filter((c) => c.id !== id));
      toast.success("Client removed");
    } catch {
      toast.error("Couldn't remove");
    }
  };

  const filtered = clients.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.company?.toLowerCase().includes(q) ?? false)
    );
  });

  if (authLoading) return null;

  return (
    <div className="bg-[var(--color-paper)] min-h-screen">
      <div className="container mx-auto px-6 py-12 max-w-[1200px]">
        <PageHeader
          eyebrow="The rolodex"
          title={<>Clients</>}
          description="Everyone who's commissioned a piece of your work."
          actions={
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="btn-accent h-11 px-5 text-sm rounded-[10px] inline-flex items-center gap-2">
                  + Add client
                </button>
              </DialogTrigger>
              <DialogContent className="bg-[var(--color-paper-soft)] border-[var(--color-hairline)] text-[var(--color-ink)] rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="font-display text-[24px] text-[var(--color-ink)]">
                    A new <span className="italic-display">arrival</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-3">
                  <Field label="Name" required>
                    <TextField value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Avery K." />
                  </Field>
                  <Field label="Email" required>
                    <TextField type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="hello@studio.co" />
                  </Field>
                  <Field label="Company">
                    <TextField value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Atlas & Bloom" />
                  </Field>
                  <Field label="Phone">
                    <TextField value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 555 0123" />
                  </Field>
                  <button
                    onClick={createClient}
                    disabled={submitting}
                    className="btn-accent w-full h-11 text-sm rounded-[10px] inline-flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Add to rolodex
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          }
        />

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-ink-subtle)]" />
          <TextField
            placeholder="Search by name, email, or company…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => <div key={i} className="h-44 skeleton rounded-[14px]" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title={search ? "No matches" : "No clients yet"}
            description={search ? "Try a different search." : "Add your first client to start sending invoices."}
            action={
              !search && (
                <button
                  onClick={() => setOpen(true)}
                  className="btn-accent h-10 px-4 text-sm rounded-[10px] inline-flex items-center gap-2"
                >
                  + Add a client
                </button>
              )
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((client) => {
              const totalPaid = client.invoices
                .filter((i) => i.status === "PAID")
                .reduce((s, i) => s + i.total, 0);
              return (
                <Panel key={client.id} hover className="p-6 group relative flex flex-col">
                  <button
                    onClick={() => deleteClient(client.id)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-md text-[var(--color-ink-subtle)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)]/60 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] flex items-center justify-center font-medium text-[15px]">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-display text-[18px] truncate">{client.name}</div>
                      {client.company && (
                        <div className="text-[12px] text-[var(--color-ink-subtle)] truncate">{client.company}</div>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 space-y-2 text-[13px] text-[var(--color-ink-muted)] flex-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[var(--color-ink-subtle)]" />
                      <span className="truncate">{client.email}</span>
                    </div>
                    {client.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[var(--color-ink-subtle)]" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-[var(--color-hairline)] flex items-end justify-between">
                    <div>
                      <div className="eyebrow !text-[10px]">Invoiced</div>
                      <div className="text-[13px] mt-0.5 font-mono tabular-nums">
                        {client._count.invoices} {client._count.invoices === 1 ? "invoice" : "invoices"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="eyebrow !text-[10px]">Paid</div>
                      <div className="numeral text-[20px] mt-0.5 leading-none">
                        {fmtMoney(totalPaid)}
                      </div>
                    </div>
                  </div>
                </Panel>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
