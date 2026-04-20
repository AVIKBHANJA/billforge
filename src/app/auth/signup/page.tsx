"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { Field, TextField } from "@/components/ui/field";
import { Loader2, Eye, EyeOff, Check } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();
  const [supabase] = useState(() => createSupabaseBrowserClient());

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const passLong = password.length >= 8;
  const passMixed = /[A-Z]/.test(password) && /[0-9]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!passLong) {
      setError("Password should be at least 8 characters.");
      return;
    }

    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const { data, error: err } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: { name: name.trim() },
      },
    });

    if (err) {
      setError(mapAuthError(err.message));
      setLoading(false);
      return;
    }

    // If email confirmations are ON, session is null and user must confirm.
    if (!data.session) {
      setInfo(`Check ${cleanEmail} for a confirmation link to finish signing up.`);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <AuthShell
      title={<>Open an <span className="italic-display">account.</span></>}
      subtitle="Free forever. Card-free. Out by lunch."
      asideEyebrow="The new arrivals desk"
      footer={
        <>
          Already have one?{" "}
          <Link href="/auth/signin" className="text-[var(--color-ink)] underline underline-offset-4 decoration-[var(--color-hairline-strong)] hover:decoration-[var(--color-ink)] font-medium">
            Sign in
          </Link>
        </>
      }
    >
      {error && (
        <div className="mb-5 px-4 py-3 rounded-lg bg-[var(--color-danger-soft)] border border-[var(--color-danger)]/25 text-[13px] text-[var(--color-danger)] animate-fade">
          {error}
        </div>
      )}

      {info && (
        <div className="mb-5 px-4 py-3 rounded-lg bg-[var(--color-success-soft)] border border-[var(--color-success)]/25 text-[13px] text-[var(--color-success)] animate-fade">
          {info}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Your name" required>
          <TextField
            type="text"
            placeholder="Avery K."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </Field>

        <Field label="Email" required>
          <TextField
            type="email"
            placeholder="you@studio.co"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </Field>

        <Field label="Password" required>
          <div className="relative">
            <TextField
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="pr-12"
              minLength={8}
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
          {password.length > 0 && (
            <div className="mt-2.5 flex items-center gap-4 text-[12px] text-[var(--color-ink-muted)]">
              <Hint ok={passLong} label="8+ chars" />
              <Hint ok={passMixed} label="A capital & a number" />
            </div>
          )}
        </Field>

        <button
          type="submit"
          disabled={loading}
          className="btn-accent w-full h-12 text-[15px] mt-2 inline-flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create account <span className="ml-1">→</span></>}
        </button>

        <p className="text-[11px] text-[var(--color-ink-subtle)] text-center pt-1">
          By signing up you agree to our{" "}
          <Link href="#" className="underline underline-offset-2 hover:text-[var(--color-ink)]">Terms</Link> and{" "}
          <Link href="#" className="underline underline-offset-2 hover:text-[var(--color-ink)]">Privacy Policy</Link>.
        </p>
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

function Hint({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${ok ? "text-[var(--color-success)]" : ""}`}>
      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${ok ? "bg-[var(--color-success-soft)]" : "bg-[var(--color-paper-deep)]"}`}>
        {ok && <Check className="w-2.5 h-2.5" />}
      </span>
      {label}
    </span>
  );
}

function mapAuthError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("already registered") || m.includes("already exists") || m.includes("user already")) {
    return "An account with this email already exists. Try signing in instead.";
  }
  if (m.includes("password") && m.includes("short")) return "Password is too short.";
  if (m.includes("rate limit")) return "Too many attempts. Try again in a minute.";
  if (m.includes("invalid email")) return "That email doesn't look right.";
  return msg;
}
