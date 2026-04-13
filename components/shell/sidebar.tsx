"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { NAV_ITEMS, type NavItem } from "./nav-items"

/** Secondary links shown only when a parent nav item is active */
const SUB_NAV: Record<string, { label: string; href: string }[]> = {
  "/formate": [
    { label: "Format-Vergleich", href: "/formate/vergleich" },
  ],
}

function NavIcon({ path, className }: { path: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-4 w-4 shrink-0", className)}
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  )
}

function NavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const pathname = usePathname()
  const isActive =
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(item.href + "/")

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-colors duration-150",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
      )}
    >
      <NavIcon
        path={item.iconPath}
        className={cn(
          "transition-colors duration-150",
          isActive
            ? "stroke-primary"
            : "stroke-current opacity-60 group-hover:opacity-90"
        )}
      />
      <span>{item.label}</span>
      {isActive && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
      )}
    </Link>
  )
}

function SubNavLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(href + '/')
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1 text-xs transition-colors duration-150",
        isActive
          ? "text-primary font-medium"
          : "text-sidebar-foreground/50 hover:text-sidebar-foreground/80"
      )}
    >
      <span className="inline-block h-px w-3 shrink-0 bg-current opacity-40" />
      {label}
    </Link>
  )
}

interface SidebarContentProps {
  onNavClick?: () => void
}

export function SidebarContent({ onNavClick }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <Link
          href="/"
          onClick={onNavClick}
          className="flex items-center gap-2.5"
        >
          {/* Payments KB logomark — stylized "P" */}
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md"
            style={{ background: "#86bc25" }}
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0a0e17"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M6 4h8a4 4 0 010 8H6V4zM6 12v8" />
            </svg>
          </span>
          <span className="font-heading text-base font-semibold tracking-wide text-sidebar-foreground">
            Payments KB
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="flex flex-col gap-0.5" role="list">
          {NAV_ITEMS.map((item) => {
            const subItems = SUB_NAV[item.href] ?? [];
            return (
              <li key={item.href}>
                <NavLink item={item} onClick={onNavClick} />
                {subItems.length > 0 && (
                  <ul className="mt-0.5 ml-7 flex flex-col gap-0.5">
                    {subItems.map((sub) => (
                      <li key={sub.href}>
                        <SubNavLink href={sub.href} label={sub.label} onClick={onNavClick} />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer hint */}
      <div className="border-t border-sidebar-border px-4 py-3">
        <p className="text-base text-muted-foreground">
          SAP Treasury · Payments KB
        </p>
      </div>
    </div>
  )
}

/** Desktop sidebar — fixed left panel */
export function DesktopSidebar() {
  return (
    <aside
      className="hidden lg:flex lg:w-[272px] lg:shrink-0 lg:flex-col"
      aria-label="Main navigation"
    >
      <div className="fixed inset-y-0 left-0 flex w-[272px] flex-col border-r border-sidebar-border bg-sidebar">
        <SidebarContent />
      </div>
    </aside>
  )
}
