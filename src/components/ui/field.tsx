import * as React from "react";
import { cn } from "@/lib/utils";

type FieldProps = {
  label?: string;
  hint?: React.ReactNode;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function Field({ label, hint, error, required, children, className }: FieldProps) {
  return (
    <label className={cn("block", className)}>
      {label && (
        <span className="flex items-center justify-between mb-1.5">
          <span className="text-[13px] font-medium text-[var(--color-ink)]">
            {label}
            {required && <span className="text-[var(--color-accent)] ml-0.5">*</span>}
          </span>
          {hint && !error && (
            <span className="text-[11px] text-[var(--color-ink-subtle)]">{hint}</span>
          )}
        </span>
      )}
      {children}
      {error && (
        <span className="block mt-1.5 text-[12px] text-[var(--color-danger)]">{error}</span>
      )}
    </label>
  );
}

export function TextField({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("field", className)} {...props} />;
}

export function TextArea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("field", className)} {...props} />;
}
