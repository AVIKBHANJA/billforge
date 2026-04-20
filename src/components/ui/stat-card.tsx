import * as React from "react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  trend?: { value: string; positive?: boolean };
  accent?: boolean;
  className?: string;
};

export function StatCard({ label, value, hint, trend, accent, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "panel p-6 flex flex-col justify-between min-h-[152px]",
        accent && "bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]",
        className
      )}
    >
      <div
        className={cn(
          "eyebrow",
          accent && "text-[var(--color-paper)]/70"
        )}
      >
        {label}
      </div>
      <div className="mt-6">
        <div
          className={cn(
            "numeral text-[44px] leading-none",
            accent ? "text-[var(--color-paper)]" : "text-[var(--color-ink)]"
          )}
        >
          {value}
        </div>
        {(hint || trend) && (
          <div className="mt-3 flex items-center gap-2 text-xs">
            {trend && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium tabular-nums",
                  trend.positive
                    ? accent
                      ? "bg-[var(--color-paper)]/10 text-[var(--color-paper)]"
                      : "bg-[var(--color-success-soft)] text-[var(--color-success)]"
                    : accent
                    ? "bg-[var(--color-paper)]/10 text-[var(--color-paper)]"
                    : "bg-[var(--color-danger-soft)] text-[var(--color-danger)]"
                )}
              >
                {trend.positive ? "↑" : "↓"} {trend.value}
              </span>
            )}
            {hint && (
              <span
                className={cn(
                  accent ? "text-[var(--color-paper)]/60" : "text-[var(--color-ink-subtle)]"
                )}
              >
                {hint}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
