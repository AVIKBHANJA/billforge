"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@/components/providers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, signOut } = useUser();
  const pathname = usePathname();

  if (pathname.startsWith("/auth/")) return null;

  const isActive = (path: string) =>
    pathname === path || (path !== "/" && pathname.startsWith(path));

  const displayName =
    (user?.user_metadata?.name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "User";

  const links = user
    ? [
        { href: "/dashboard", label: "Overview" },
        { href: "/invoices", label: "Invoices" },
        { href: "/clients", label: "Clients" },
        { href: "/time", label: "Time" },
      ]
    : [];

  return (
    <nav className="sticky top-0 z-50 bg-[var(--color-paper)]/85 backdrop-blur-xl border-b border-[var(--color-hairline)]">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 max-w-[1200px]">
        {/* Mark */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="font-display text-[26px] leading-none text-[var(--color-ink)]">
            Bill<span className="italic-display text-[var(--color-accent)]">forge</span>
          </span>
          <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-[var(--color-ink-subtle)]" />
          <span className="hidden sm:inline-block eyebrow !text-[10px]">Est. 2026</span>
        </Link>

        {/* Centred app links */}
        {user && (
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 text-sm rounded-md transition-colors ${
                  isActive(item.href)
                    ? "text-[var(--color-ink)] bg-[var(--color-paper-deep)]"
                    : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-soft)]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/invoices/new" className="hidden sm:inline-flex">
                <button className="btn-accent h-9 px-4 text-sm rounded-[10px] inline-flex items-center gap-1.5">
                  + New invoice
                </button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-9 h-9 rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] text-[13px] font-medium hover:bg-[var(--color-ink-2)] transition-colors flex items-center justify-center">
                    {displayName.charAt(0).toUpperCase()}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-60 bg-[var(--color-paper-soft)] border border-[var(--color-hairline)] text-[var(--color-ink)] rounded-xl shadow-lg p-1.5"
                >
                  <div className="px-3 py-2.5">
                    <div className="text-sm font-medium">{displayName}</div>
                    <div className="text-xs text-[var(--color-ink-subtle)] mt-0.5 truncate">
                      {user.email}
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-[var(--color-hairline)]" />
                  <div className="md:hidden">
                    {links.map((l) => (
                      <DropdownMenuItem key={l.href} asChild className="text-sm cursor-pointer rounded-md focus:bg-[var(--color-paper-deep)]">
                        <Link href={l.href}>{l.label}</Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator className="bg-[var(--color-hairline)] md:hidden" />
                  </div>
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="text-[var(--color-danger)] focus:text-[var(--color-danger)] focus:bg-[var(--color-danger-soft)]/60 cursor-pointer text-sm rounded-md"
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-soft)] text-sm"
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/auth/signup">
                <button className="btn-accent h-9 px-4 text-sm rounded-[10px]">
                  Open account
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
