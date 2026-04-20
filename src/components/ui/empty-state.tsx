import * as React from "react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "panel p-16 text-center flex flex-col items-center justify-center min-h-[280px]",
        className
      )}
    >
      {icon && (
        <div className="mb-5 w-12 h-12 rounded-full bg-[var(--color-paper-deep)] flex items-center justify-center text-[var(--color-ink-muted)]">
          {icon}
        </div>
      )}
      <div className="font-display text-2xl text-[var(--color-ink)]">{title}</div>
      {description && (
        <p className="mt-2 text-sm text-[var(--color-ink-muted)] max-w-sm">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
