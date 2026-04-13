/**
 * Fullscreen route group layout.
 * The actual fullscreen shell (edge-to-edge main, no padding) is handled
 * by AppShell detecting these paths. This layout is a transparent pass-through
 * so the route group can share its own sub-layout if needed in future.
 */
export default function FullscreenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
