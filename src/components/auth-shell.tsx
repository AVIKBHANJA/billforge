import Link from "next/link";
import * as React from "react";

type AuthShellProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  asideEyebrow?: string;
};

export function AuthShell({ title, subtitle, footer, children, asideEyebrow = "The accounts office" }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-[var(--color-paper)] grid grid-cols-1 lg:grid-cols-12">
      {/* Decorative aside */}
      <aside className="hidden lg:flex lg:col-span-5 relative bg-[var(--color-ink)] text-[var(--color-paper)] flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 paper-noise opacity-[0.06]" />

        <div className="relative">
          <Link href="/" className="font-display text-[28px] leading-none">
            Bill<span className="italic-display text-[var(--color-accent)]">forge</span>
          </Link>
          <div className="mt-2 eyebrow !text-[10px] !text-[var(--color-paper)]/50">{asideEyebrow}</div>
        </div>

        <div className="relative">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-10 bg-[var(--color-paper)]/40" />
            <span className="eyebrow !text-[10px] !text-[var(--color-paper)]/60">A note from the editor</span>
          </div>

          <p className="font-display italic-display text-[36px] leading-[1.15] text-[var(--color-paper)]">
            &ldquo;Of all the books a freelancer keeps, the one that matters most is the one that gets you paid.&rdquo;
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-[var(--color-paper)]/15">
            {[
              { k: "$ 12.4M", v: "Invoiced" },
              { k: "10.2k", v: "Independents" },
              { k: "6.4d", v: "Time to paid" },
            ].map((s) => (
              <div key={s.v}>
                <div className="numeral text-[26px] leading-none text-[var(--color-paper)]">{s.k}</div>
                <div className="text-[10px] uppercase tracking-widest mt-2 text-[var(--color-paper)]/50">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative font-mono text-[10px] text-[var(--color-paper)]/40 flex justify-between">
          <span>Vol. 01 · Issue 04</span>
          <span>Apr · MMXXVI</span>
        </div>
      </aside>

      {/* Form column */}
      <main className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden mb-10">
            <Link href="/" className="font-display text-[26px] leading-none text-[var(--color-ink)]">
              Bill<span className="italic-display text-[var(--color-accent)]">forge</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="display-lg text-[var(--color-ink)]">{title}</h1>
            {subtitle && <p className="mt-2 text-[15px] text-[var(--color-ink-muted)]">{subtitle}</p>}
          </div>

          {children}

          {footer && <div className="mt-8 text-center text-[13px] text-[var(--color-ink-muted)]">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
