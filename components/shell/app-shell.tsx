"use client"

import { usePathname } from "next/navigation"
import { Topbar } from "./topbar"

interface AppShellProps {
  children: React.ReactNode
}

/** Routes that get edge-to-edge fullscreen content (no padding, fixed height) */
const FULLSCREEN_PATHS = [
  "/regulatorik",
  "/formate",
  "/clearing",
  "/zahlungsarten",
  "/ihb",
  "/laender",
]

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()

  // Render bare page on login (no shell)
  if (pathname === "/login") {
    return <>{children}</>
  }

  const isFullscreen = FULLSCREEN_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Topbar className="sticky top-0 z-30" />
      {isFullscreen ? (
        <main
          className="flex flex-col overflow-hidden w-full"
          style={{ height: 'calc(100vh - 56px)' }}
        >
          {children}
        </main>
      ) : (
        <main className="flex-1 px-6 py-6 md:px-10 md:py-8">
          {children}
        </main>
      )}
    </div>
  )
}
