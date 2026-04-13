"use client"

import { DesktopSidebar } from "./sidebar"
import { Topbar } from "./topbar"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <DesktopSidebar />

      {/* Right side: topbar + main */}
      <div className="flex flex-1 flex-col lg:pl-[272px]">
        <Topbar className="sticky top-0 z-30" />
        <main className="flex-1 px-6 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
