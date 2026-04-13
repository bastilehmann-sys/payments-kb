"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import { SidebarContent } from "./sidebar"
import { NAV_ITEMS } from "./nav-items"
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { signOut } from "next-auth/react"
import { SearchDialog } from "@/components/search/search-dialog"

const FULLSCREEN_PATHS = [
  "/regulatorik",
  "/formate",
  "/clearing",
  "/zahlungsarten",
  "/ihb",
  "/laender",
]

interface TopbarProps {
  className?: string
}

export function Topbar({ className }: TopbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()
  const isFullscreen = FULLSCREEN_PATHS.some((p) => pathname.startsWith(p))

  // Global Cmd+K / Ctrl+K hotkey
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <header
      className={cn(
        "flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-sm",
        className
      )}
    >
      {/* Hamburger — mobile always + desktop on fullscreen routes as fallback */}
      <button
        onClick={() => setMobileOpen(true)}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground",
          isFullscreen ? "lg:hidden" : "lg:hidden"
        )}
        aria-label="Open navigation"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {/* Logo — visible on mobile always, on desktop only when sidebar is hidden */}
      <Link
        href="/"
        className={cn(
          "font-heading text-base font-semibold text-foreground lg:hidden",
          isFullscreen && "lg:inline"
        )}
      >
        Payments KB
      </Link>

      {/* Horizontal nav — shown on fullscreen routes where sidebar is hidden */}
      {isFullscreen && (
        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.filter((item) => item.href !== "/").map((item) => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search button */}
      <button
        onClick={() => setSearchOpen(true)}
        className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-border hover:bg-muted/70 hover:text-foreground"
        aria-label="Suche öffnen (Cmd K)"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5 shrink-0"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <span className="hidden sm:inline">Suche</span>
        <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 font-mono text-xs text-muted-foreground sm:inline">
          ⌘K
        </kbd>
      </button>

      {/* Theme toggle */}
      <ThemeToggle />

      {/* User menu with logout */}
      <button
        onClick={() => signOut({ redirectTo: "/login" })}
        className="flex h-8 items-center gap-2 rounded-md border border-border bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
        title="Abmelden"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5 shrink-0"
          aria-hidden="true"
        >
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span className="hidden sm:inline">Abmelden</span>
      </button>

      {/* Mobile nav sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" showCloseButton className="w-[272px] p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent onNavClick={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Search dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  )
}
