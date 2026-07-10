"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import {
  CircleUserRound,
  LogIn,
  LogOut,
  Search,
  UserRound,
  UserRoundPlus,
  Wrench,
} from "lucide-react";

const ACCOUNT_LINKS = [
  { href: "/account/repairs", label: "My Repairs", icon: Wrench },
  { href: "/track", label: "Track My Repair", icon: Search },
  { href: "/account", label: "Account Details", icon: UserRound },
];

/** Desktop navbar auth area: Log In / Sign Up, or the account menu. */
export function AuthMenu() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  // Reserve space while the stored session loads to avoid layout shift
  if (loading) return <div className="h-10 w-10" aria-hidden="true" />;

  if (!user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Account"
            title="Account"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <CircleUserRound className="h-[18px] w-[18px]" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[180px]">
          <DropdownMenuLabel className="py-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Account
            </p>
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href="/login">
              <LogIn className="h-4 w-4" />
              Log In
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/signup">
              <UserRoundPlus className="h-4 w-4" />
              Sign Up
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/track">
              <Search className="h-4 w-4" />
              Track My Repair
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Account menu — ${user.name}`}
          title="Account"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <CircleUserRound className="h-[18px] w-[18px]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <p className="text-[13px] font-semibold text-foreground">{user.name}</p>
          <p className="truncate text-[12px] font-normal text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ACCOUNT_LINKS.map(({ href, label, icon: Icon }) => (
          <DropdownMenuItem key={href} asChild>
            <Link href={href}>
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            signOut();
            router.push("/");
          }}
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Mobile sheet auth area. `onNavigate` lets the parent close the sheet.
 */
export function AuthMenuMobile({ onNavigate }: { onNavigate?: () => void }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  if (loading) return null;

  if (!user) {
    return (
      <div className="grid grid-cols-2 gap-2.5">
        <Button
          asChild
          variant="outline"
          className="h-11 border-border text-sm"
          onClick={onNavigate}
        >
          <Link href="/login">Log In</Link>
        </Button>
        <Button asChild className="btn-primary h-11 text-sm" onClick={onNavigate}>
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      <div className="mb-2 flex items-center gap-2.5 px-4">
        <CircleUserRound className="h-5 w-5 text-[color:var(--icon-fg)]" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
          <p className="truncate text-[12px] text-muted-foreground">{user.email}</p>
        </div>
      </div>
      {ACCOUNT_LINKS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
      <button
        type="button"
        onClick={() => {
          signOut();
          onNavigate?.();
          router.push("/");
        }}
        className="flex w-full items-center gap-2.5 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
      >
        <LogOut className="h-4 w-4" />
        Log Out
      </button>
    </div>
  );
}
