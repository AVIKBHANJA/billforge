"use client";

import Link from "next/link";
import { useUser } from "@/components/providers";

type Props = {
  size?: "lg" | "md";
  variant?: "accent" | "ink";
  signedInLabel?: string;
  signedOutLabel?: string;
  className?: string;
};

export function HeroCTA({
  size = "lg",
  variant = "accent",
  signedInLabel = "Open dashboard",
  signedOutLabel = "Open free account",
  className = "",
}: Props) {
  const { user } = useUser();
  const href = user ? "/dashboard" : "/auth/signup";
  const label = user ? signedInLabel : signedOutLabel;
  const sizeClasses = size === "lg" ? "h-12 px-7 text-[15px]" : "h-10 px-5 text-sm";
  const variantClass = variant === "accent" ? "btn-accent" : "btn-ink";

  return (
    <Link href={href} className={`${variantClass} ${sizeClasses} inline-flex items-center gap-2 ${className}`}>
      {label}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" />
      </svg>
    </Link>
  );
}
