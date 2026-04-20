import * as React from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8 mb-8 border-b border-[var(--color-hairline)]", className)}>
      <div className="max-w-2xl">
        {eyebrow && <div className="eyebrow mb-3">{eyebrow}</div>}
        <h1 className="display-lg text-[var(--color-ink)]">{title}</h1>
        {description && (
          <p className="mt-3 text-[15px] text-[var(--color-ink-muted)] leading-relaxed">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </header>
  );
}
