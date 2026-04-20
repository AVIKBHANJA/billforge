import Link from "next/link";
import { HeroCTA } from "@/components/hero-cta";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";

export default function LandingPage() {
  return (
    <div className="bg-[var(--color-paper)] text-[var(--color-ink)] overflow-hidden">

      {/* ============ HERO ============ */}
      <section className="relative pt-20 pb-28 lg:pt-28 lg:pb-36">
        {/* Subtle grid + grain */}
        <div className="absolute inset-0 -z-10 paper-noise" />
        <div className="absolute top-0 left-0 right-0 h-[700px] -z-10 hairline-grid" style={{ maskImage: "linear-gradient(to bottom, black, transparent)" }} />

        <div className="container mx-auto max-w-[1200px] px-6">
          {/* Eyebrow with hairline */}
          <div className="flex items-center gap-4 animate-fade">
            <div className="h-px w-10 bg-[var(--color-ink)]" />
            <span className="eyebrow">Vol. 01 — Issue 04 — April, MMXXVI</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
            {/* Headline */}
            <div className="lg:col-span-7 animate-rise">
              <h1 className="display-hero">
                Invoicing,
                <br />
                with a little
                <br />
                <span className="italic-display accent-mark">restraint.</span>
              </h1>
              <p className="mt-8 text-[18px] leading-[1.55] text-[var(--color-ink-muted)] max-w-[520px]">
                BillForge is a calmer way for independent practitioners to bill their work, track time, and keep the books. No banner ads. No upsells. Just a tool that respects your craft.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <HeroCTA />
                <Link
                  href="#features"
                  className="btn-ghost-ink h-12 px-6 text-[15px] inline-flex items-center gap-2"
                >
                  See the system
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-6 text-[13px] text-[var(--color-ink-muted)]">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
                  No credit card
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
                  Free forever tier
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
                  Export anything
                </span>
              </div>
            </div>

            {/* Mock invoice */}
            <div className="lg:col-span-5 animate-rise delay-200">
              <div className="relative">
                {/* Stack effect */}
                <div className="absolute inset-0 translate-x-3 translate-y-3 panel" style={{ background: "var(--color-paper-deep)" }} />
                <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 panel" style={{ background: "var(--color-paper-soft)" }} />

                <Panel className="relative p-7">
                  <div className="flex items-start justify-between pb-5 border-b border-[var(--color-hairline)]">
                    <div>
                      <div className="eyebrow">Invoice</div>
                      <div className="font-mono text-sm mt-1">INV-0042</div>
                    </div>
                    <StatusBadge status="PAID" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-5 text-[13px] border-b border-[var(--color-hairline)]">
                    <div>
                      <div className="eyebrow !text-[10px]">Billed to</div>
                      <div className="font-medium mt-1">Atlas & Bloom Studio</div>
                      <div className="text-[var(--color-ink-muted)]">accounts@atlasbloom.co</div>
                    </div>
                    <div>
                      <div className="eyebrow !text-[10px]">Issued</div>
                      <div className="font-medium mt-1 tabular-nums">04 / 03 / 2026</div>
                      <div className="text-[var(--color-ink-muted)] tabular-nums">Due 18 / 03</div>
                    </div>
                  </div>

                  <div className="py-5 space-y-2.5 text-[13px]">
                    <Row label="Brand identity system" value="$ 2,400.00" />
                    <Row label="Visual direction & moodboards" value="$ 1,200.00" />
                    <Row label="Client workshops (3)" value="$    900.00" />
                  </div>

                  <div className="pt-4 border-t border-[var(--color-hairline)]">
                    <div className="flex items-end justify-between">
                      <span className="eyebrow">Total due</span>
                      <span className="numeral text-[36px] leading-none">
                        $ 4,500<span className="text-[var(--color-ink-subtle)]">.00</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-dashed border-[var(--color-hairline-strong)] flex items-center justify-between text-[12px] text-[var(--color-ink-subtle)]">
                    <span>Paid in full · Mar 14</span>
                    <span className="font-mono">{"<3 days early>"}</span>
                  </div>
                </Panel>

                {/* Floating note */}
                <div className="absolute -bottom-6 -left-6 panel p-4 max-w-[200px] hidden md:block animate-rise delay-500">
                  <div className="eyebrow !text-[10px]">Avg. time to paid</div>
                  <div className="numeral text-[28px] mt-1 leading-none">
                    6.4<span className="text-[16px] text-[var(--color-ink-muted)]"> days</span>
                  </div>
                  <div className="text-[11px] text-[var(--color-ink-subtle)] mt-1">vs. 41 industry avg</div>
                </div>
              </div>
            </div>
          </div>

          {/* Marquee strip */}
          <div className="mt-24 pt-8 border-t border-[var(--color-hairline)] grid grid-cols-2 md:grid-cols-4 gap-y-6 text-center md:text-left">
            {[
              { k: "$ 12.4M", v: "Invoiced through" },
              { k: "10,200+", v: "Independents" },
              { k: "6.4 days", v: "Avg. paid in" },
              { k: "0", v: "Setup fees" },
            ].map((x) => (
              <div key={x.v} className="md:border-l md:border-[var(--color-hairline)] md:pl-6">
                <div className="numeral text-[28px] leading-none">{x.k}</div>
                <div className="eyebrow !text-[10px] mt-2">{x.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MANIFESTO ============ */}
      <section className="border-y border-[var(--color-hairline)] bg-[var(--color-paper-soft)]">
        <div className="container mx-auto max-w-[1200px] px-6 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-2">
              <div className="eyebrow">A note</div>
              <div className="text-[12px] text-[var(--color-ink-subtle)] mt-2 font-mono">§ 01</div>
            </div>
            <div className="lg:col-span-9">
              <p className="display-xl text-[var(--color-ink)]">
                We built this for the freelancer who&apos;d rather <span className="italic-display">spend the afternoon</span> on the work, not the ledger.
              </p>
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { n: "01", t: "Quiet defaults", d: "Sensible numbering, currency, and tax rules out of the box." },
                  { n: "02", t: "Every page printable", d: "Pixel-faithful PDFs, never an attached image of a screenshot." },
                  { n: "03", t: "Yours to leave", d: "One-click export of every invoice, client, and time entry. Anytime." },
                ].map((x) => (
                  <div key={x.n}>
                    <div className="font-mono text-[11px] text-[var(--color-accent)]">{x.n}</div>
                    <div className="font-display text-[22px] mt-1.5">{x.t}</div>
                    <p className="text-[14px] text-[var(--color-ink-muted)] mt-2 leading-relaxed">{x.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURE SPREAD ============ */}
      <section id="features" className="container mx-auto max-w-[1200px] px-6 py-24 lg:py-32">
        <div className="flex items-end justify-between mb-12 pb-6 border-b border-[var(--color-hairline)]">
          <div>
            <div className="eyebrow">The system</div>
            <h2 className="display-xl mt-3 max-w-xl">
              Four moving parts. <span className="italic-display">No moving fees.</span>
            </h2>
          </div>
          <div className="hidden md:block text-right">
            <div className="font-mono text-[11px] text-[var(--color-ink-subtle)]">FIG. 1.0 — 1.4</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Feature 1 — large */}
          <Panel hover className="md:col-span-7 p-9 relative overflow-hidden min-h-[340px]">
            <span className="font-mono text-[11px] text-[var(--color-ink-subtle)]">01 — INVOICING</span>
            <h3 className="font-display text-[34px] leading-tight mt-4 max-w-md">
              Compose an invoice in under a minute, not under duress.
            </h3>
            <p className="text-[14px] text-[var(--color-ink-muted)] mt-3 max-w-md leading-relaxed">
              Auto-numbered, currency-aware, with line items that calculate themselves. Send by email; print to PDF; archive forever.
            </p>

            <div className="absolute right-6 bottom-6 panel p-4 w-[230px]">
              <div className="flex items-center justify-between text-[12px] mb-3">
                <span className="font-mono">INV-0044</span>
                <StatusBadge status="DRAFT" />
              </div>
              <div className="space-y-1.5 text-[12px]">
                <div className="flex justify-between"><span>Discovery</span><span className="font-mono">$1,200</span></div>
                <div className="flex justify-between"><span>Design system</span><span className="font-mono">$3,400</span></div>
                <div className="flex justify-between"><span>Hand-off</span><span className="font-mono">$  600</span></div>
              </div>
              <div className="mt-3 pt-3 border-t border-dashed border-[var(--color-hairline)] flex justify-between font-mono text-[13px]">
                <span>Total</span><span>$5,200</span>
              </div>
            </div>
          </Panel>

          {/* Feature 2 — small */}
          <Panel hover className="md:col-span-5 p-9 relative overflow-hidden min-h-[340px]">
            <span className="font-mono text-[11px] text-[var(--color-ink-subtle)]">02 — TIME</span>
            <h3 className="font-display text-[28px] leading-tight mt-4">
              A timer that doesn&apos;t feel like surveillance.
            </h3>
            <p className="text-[14px] text-[var(--color-ink-muted)] mt-3 leading-relaxed">
              Click to start. Forget about it. Bill it later.
            </p>

            <div className="absolute right-6 bottom-6 left-6 panel-deep p-5 flex items-center gap-4">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] animate-blink" />
              <div className="flex-1">
                <div className="numeral text-[28px] text-[var(--color-paper)] leading-none tabular-nums">02:34:17</div>
                <div className="text-[11px] text-[var(--color-paper)]/60 mt-1">Atlas & Bloom — Brand work</div>
              </div>
              <button className="w-9 h-9 rounded-full bg-[var(--color-paper)] text-[var(--color-ink)] flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><rect width="10" height="10" rx="1" /></svg>
              </button>
            </div>
          </Panel>

          {/* Feature 3 — small */}
          <Panel hover className="md:col-span-5 p-9 relative overflow-hidden min-h-[300px]">
            <span className="font-mono text-[11px] text-[var(--color-ink-subtle)]">03 — CLIENTS</span>
            <h3 className="font-display text-[28px] leading-tight mt-4">
              A rolodex that <span className="italic-display">remembers everything.</span>
            </h3>
            <p className="text-[14px] text-[var(--color-ink-muted)] mt-3 leading-relaxed">
              Every project, every dollar, every email — kept where you can find them.
            </p>

            <div className="absolute right-6 bottom-6 flex -space-x-2">
              {["A", "B", "M", "S", "K"].map((l, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--color-paper-soft)] bg-[var(--color-ink)] text-[var(--color-paper)] flex items-center justify-center text-[12px] font-medium">
                  {l}
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-[var(--color-paper-soft)] bg-[var(--color-paper-deep)] text-[var(--color-ink-muted)] flex items-center justify-center text-[11px] font-mono">
                +14
              </div>
            </div>
          </Panel>

          {/* Feature 4 — large */}
          <Panel hover className="md:col-span-7 p-9 relative overflow-hidden min-h-[300px]">
            <span className="font-mono text-[11px] text-[var(--color-ink-subtle)]">04 — REVENUE</span>
            <h3 className="font-display text-[34px] leading-tight mt-4 max-w-md">
              The numbers, plainly.
            </h3>
            <p className="text-[14px] text-[var(--color-ink-muted)] mt-3 max-w-md leading-relaxed">
              No vanity charts. Just the figures that decide whether you get to take next month off.
            </p>

            <div className="absolute right-9 bottom-8 left-auto flex items-end gap-1.5 h-[80px] w-[260px]">
              {[42, 56, 38, 71, 48, 84, 64, 92, 73, 88, 76, 95].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-[var(--color-ink)]"
                  style={{ height: `${h}%`, opacity: 0.2 + (i / 12) * 0.8 }}
                />
              ))}
            </div>
          </Panel>
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section className="border-y border-[var(--color-hairline)] bg-[var(--color-paper-soft)]">
        <div className="container mx-auto max-w-[1200px] px-6 py-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="eyebrow">The flow</div>
              <h2 className="display-xl mt-3">From draft to deposit.</h2>
            </div>
            <div className="hidden md:block font-mono text-[11px] text-[var(--color-ink-subtle)]">FIG. 2.0</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--color-hairline)] border border-[var(--color-hairline)] rounded-2xl overflow-hidden">
            {[
              { n: "i.", t: "Compose", d: "Pick the client, drop in line items, set the due date. Save as draft or send straight away." },
              { n: "ii.", t: "Deliver", d: "Email the invoice with a payment link. Get a quiet ping when it’s opened." },
              { n: "iii.", t: "Reconcile", d: "Mark paid (or let webhooks do it). Keep a tidy paper trail for tax season." },
            ].map((s, i) => (
              <div key={s.n} className="bg-[var(--color-paper-soft)] p-9 relative">
                <div className="font-display text-[40px] italic-display text-[var(--color-accent)] leading-none">{s.n}</div>
                <h3 className="font-display text-[24px] mt-4">{s.t}</h3>
                <p className="text-[14px] text-[var(--color-ink-muted)] mt-2 leading-relaxed">{s.d}</p>
                {i < 2 && (
                  <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 rounded-full bg-[var(--color-paper-soft)] border border-[var(--color-hairline)] items-center justify-center z-10">
                    <span className="text-[var(--color-ink-muted)]">→</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIAL ============ */}
      <section className="container mx-auto max-w-[1200px] px-6 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-2 hidden lg:block">
            <div className="eyebrow">Testimonial</div>
            <div className="font-mono text-[11px] text-[var(--color-ink-subtle)] mt-2">No. 04</div>
          </div>
          <div className="lg:col-span-10">
            <blockquote className="display-xl text-[var(--color-ink)]">
              <span className="italic-display text-[var(--color-accent)]">&ldquo;</span>
              Felt like switching from a spreadsheet to a really nice notebook.
              I haven&apos;t missed a follow-up since I started.
              <span className="italic-display text-[var(--color-accent)]">&rdquo;</span>
            </blockquote>
            <div className="mt-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] flex items-center justify-center font-medium">SK</div>
              <div>
                <div className="font-medium text-[15px]">Sarah Kuroda</div>
                <div className="text-[13px] text-[var(--color-ink-muted)]">Independent brand designer · Tokyo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="pricing" className="border-t border-[var(--color-hairline)]">
        <div className="container mx-auto max-w-[1200px] px-6 py-24">
          <div className="flex items-end justify-between mb-12 pb-6 border-b border-[var(--color-hairline)]">
            <div>
              <div className="eyebrow">Pricing</div>
              <h2 className="display-xl mt-3">Flat rates. <span className="italic-display">No surprises.</span></h2>
            </div>
            <div className="hidden md:block font-mono text-[11px] text-[var(--color-ink-subtle)]">3 PLANS</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: "Solo",
                price: "0",
                tagline: "For getting your first invoice out the door.",
                features: ["Up to 5 clients", "10 invoices / month", "PDF export", "Email support"],
                cta: "Start for free",
                accent: false,
              },
              {
                name: "Studio",
                price: "15",
                tagline: "For independents earning a living from this.",
                features: ["Unlimited clients & invoices", "Time tracking", "Stripe & Razorpay", "Recurring billing", "Priority support"],
                cta: "Start trial",
                accent: true,
              },
              {
                name: "Atelier",
                price: "29",
                tagline: "For small teams keeping it boutique.",
                features: ["Everything in Studio", "Up to 10 seats", "Client portal", "Multi-currency reporting", "Dedicated support"],
                cta: "Talk to us",
                accent: false,
              },
            ].map((tier) => (
              <Panel
                key={tier.name}
                className={`p-8 flex flex-col ${tier.accent ? "panel-deep border-[var(--color-ink)]" : ""}`}
              >
                <div className="flex items-baseline justify-between">
                  <h3 className={`font-display text-[26px] ${tier.accent ? "text-[var(--color-paper)]" : ""}`}>
                    {tier.name}
                  </h3>
                  {tier.accent && (
                    <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--color-accent)]">
                      Recommended
                    </span>
                  )}
                </div>
                <p className={`mt-2 text-[13px] ${tier.accent ? "text-[var(--color-paper)]/70" : "text-[var(--color-ink-muted)]"}`}>
                  {tier.tagline}
                </p>

                <div className="mt-7 flex items-baseline gap-1">
                  <span className={`numeral text-[56px] leading-none ${tier.accent ? "text-[var(--color-paper)]" : ""}`}>
                    ${tier.price}
                  </span>
                  <span className={`text-[13px] ${tier.accent ? "text-[var(--color-paper)]/60" : "text-[var(--color-ink-muted)]"}`}>
                    /month
                  </span>
                </div>

                <div className={`mt-6 h-px ${tier.accent ? "bg-[var(--color-paper)]/15" : "bg-[var(--color-hairline)]"}`} />

                <ul className="mt-6 space-y-3 flex-1">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className={`flex items-start gap-3 text-[13px] ${tier.accent ? "text-[var(--color-paper)]/85" : "text-[var(--color-ink-2)]"}`}
                    >
                      <span className={`mt-[7px] w-1 h-1 rounded-full ${tier.accent ? "bg-[var(--color-accent)]" : "bg-[var(--color-ink)]"}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <HeroCTA
                    variant={tier.accent ? "accent" : "ink"}
                    size="md"
                    signedOutLabel={tier.cta}
                    signedInLabel="Open dashboard"
                    className="w-full justify-center"
                  />
                </div>
              </Panel>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="border-t border-[var(--color-hairline)] bg-[var(--color-paper-soft)] relative overflow-hidden">
        <div className="absolute inset-0 paper-noise" />
        <div className="relative container mx-auto max-w-[1100px] px-6 py-24 lg:py-32 text-center">
          <div className="eyebrow">Ready when you are</div>
          <h2 className="display-hero mt-6">
            Start a quieter
            <br />
            <span className="italic-display accent-mark">billing practice.</span>
          </h2>
          <p className="mt-8 text-[17px] text-[var(--color-ink-muted)] max-w-lg mx-auto leading-relaxed">
            Free to begin. No card required. Your first invoice could be out by lunch.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <HeroCTA />
            <Link
              href="#pricing"
              className="text-[var(--color-ink)] underline underline-offset-4 decoration-[var(--color-hairline-strong)] hover:decoration-[var(--color-ink)] transition-colors text-[15px]"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-[var(--color-hairline)]">
        <div className="container mx-auto max-w-[1200px] px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <span className="font-display text-[28px] leading-none">
                Bill<span className="italic-display text-[var(--color-accent)]">forge</span>
              </span>
              <p className="mt-3 text-[13px] text-[var(--color-ink-muted)] max-w-xs">
                A quieter way to bill. Made with patience.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-[13px]">
              {["Privacy", "Terms", "Changelog", "Status", "Contact"].map((l) => (
                <Link key={l} href="#" className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors">{l}</Link>
              ))}
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-[var(--color-hairline)] flex flex-col sm:flex-row justify-between text-[12px] text-[var(--color-ink-subtle)] gap-3">
            <span>© {new Date().getFullYear()} BillForge. All rights reserved.</span>
            <span className="font-mono">v 0.4.0 · last shipped {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[var(--color-ink-2)]">{label}</span>
      <span className="font-mono text-[var(--color-ink)] tabular-nums">{value}</span>
    </div>
  );
}
