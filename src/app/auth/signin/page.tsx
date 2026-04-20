"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { Field, TextField } from "@/components/ui/field";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignInPage() {
  return (
    <Suspense>
      <SignInContent />
    </Suspense>
  );
}

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  const [supabase] = useState(() => createSupabaseBrowserClient());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (err) {
      setError(mapAuthError(err.message));
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  };

  return (
    <AuthShell
      title={<>Welcome <span className="italic-display">back.</span></>}
      subtitle="Sign in to pick up where you left off."
      footer={
        <>
          New around here?{" "}
          <Link href="/auth/signup" className="text-[var(--color-ink)] underline underline-offset-4 decoration-[var(--color-hairline-strong)] hover:decoration-[var(--color-ink)] font-medium">
            Open an account
          </Link>
        </>
      }
    >
      {error && (
        <div className="mb-5 px-4 py-3 rounded-lg bg-[var(--color-danger-soft)] border border-[var(--color-danger)]/25 text-[13px] text-[var(--color-danger)] animate-fade">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email">
          <TextField
            type="email"
            placeholder="you@studio.co"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </Field>

        <Field
          label="Password"
          hint={
            <Link href="#" className="text-[var(--color-accent)] hover:underline">Forgot?</Link>
          }
        >
          <div className="relative">
            <TextField
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)] transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>

        <button
          type="submit"
          disabled={loading}
          className="btn-accent w-full h-12 text-[15px] mt-2 inline-flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <span className="ml-1">→</span></>}
        </button>
      </form>

      <div className="my-7 flex items-center gap-4">
        <div className="flex-1 h-px bg-[var(--color-hairline)]" />
        <span className="text-[11px] uppercase tracking-widest text-[var(--color-ink-subtle)]">or</span>
        <div className="flex-1 h-px bg-[var(--color-hairline)]" />
      </div>

      <button
        type="button"
        disabled
        title="Coming soon"
        className="relative w-full h-12 inline-flex items-center justify-center gap-3 rounded-[10px] border border-[var(--color-hairline)] bg-[var(--color-paper-deep)]/40 text-[var(--color-ink-subtle)] cursor-not-allowed"
      >
        <svg className="h-[18px] w-[18px] opacity-50" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
        <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest bg-[var(--color-paper)] border border-[var(--color-hairline)] text-[var(--color-ink-muted)]">
          Soon
        </span>
      </button>
    </AuthShell>
  );
}

function mapAuthError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login")) return "Email or password didn't match.";
  if (m.includes("email not confirmed")) return "Confirm your email first — check your inbox.";
  if (m.includes("rate limit")) return "Too many attempts. Try again in a minute.";
  return msg;
}
