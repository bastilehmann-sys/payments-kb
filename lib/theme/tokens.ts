/**
 * Design tokens extracted from learning.norinit.de
 * Source: https://learning.norinit.de/_next/static/chunks/52c1482b86cdec7a.css
 * Extracted: 2026-04-13
 *
 * The platform is dark-first. Dark tokens are authoritative.
 * Light tokens are approximations derived from the surface hierarchy.
 */

// ── Accent ────────────────────────────────────────────────────────────────────
export const accent = {
  default: "#86bc25",
  hover: "#9ad03a",
  glow: "rgba(134,188,37,0.149)",
  glowStrong: "rgba(134,188,37,0.251)",
  muted: "rgba(134,188,37,0.078)",
} as const;

// ── Dark mode surfaces ────────────────────────────────────────────────────────
export const darkColors = {
  background: "#0a0e17",
  backgroundSecondary: "#0f1420",
  backgroundSurface: "#151a28",
  backgroundSurfaceHover: "#1a2033",
  backgroundElevated: "#1e2538",
  borderSubtle: "rgba(255,255,255,0.059)",
  borderDefault: "rgba(255,255,255,0.078)",
  borderStrong: "rgba(255,255,255,0.122)",
  textPrimary: "#e8ecf4",
  textSecondary: "#b0b8cc",
  textTertiary: "#7d87a0",
  textInverse: "#0a0e17",
} as const;

// ── Light mode surfaces (approximated) ───────────────────────────────────────
export const lightColors = {
  background: "#f9fafb",
  backgroundSecondary: "#f3f4f6",
  backgroundSurface: "#ffffff",
  backgroundElevated: "#ffffff",
  borderSubtle: "rgba(0,0,0,0.06)",
  borderDefault: "rgba(0,0,0,0.08)",
  borderStrong: "rgba(0,0,0,0.12)",
  textPrimary: "#101828",
  textSecondary: "#4a5565",
  textTertiary: "#6a7282",
  textInverse: "#ffffff",
} as const;

// ── Semantic colors ───────────────────────────────────────────────────────────
export const semanticColors = {
  red: "#fb2c36",
  redLight: "#ff6568",
  purple: "#ac4bff",
  gray50: "#f9fafb",
  gray100: "#f3f4f6",
  gray200: "#e5e7eb",
  gray300: "#d1d5dc",
  gray400: "#99a1af",
  gray500: "#6a7282",
  gray600: "#4a5565",
  gray900: "#101828",
} as const;

// ── Module color palette (used for charts/data viz) ───────────────────────────
export const moduleColors = {
  overview: "#86bc25",
  bp: "#4a9eff",
  bam: "#00c2e0",
  bcm: "#7ed321",
  mbc: "#b47aff",
  apm: "#ff6b6b",
  ihb: "#ffb340",
  trm: "#34d399",
} as const;

// ── Typography ────────────────────────────────────────────────────────────────
export const fonts = {
  display: "Syne",
  body: "Outfit",
  mono: "JetBrains Mono",
  monoFallback: "Fira Code",
} as const;

export const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

// ── Border radius ─────────────────────────────────────────────────────────────
export const radius = {
  sm: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
} as const;

// ── Shadows ───────────────────────────────────────────────────────────────────
export const shadows = {
  sm: "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)",
  md: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
  lg: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
  glow: "0 0 24px rgba(134,188,37,0.122), 0 0 48px rgba(134,188,37,0.059)",
} as const;

// ── Layout ────────────────────────────────────────────────────────────────────
export const layout = {
  sidebarWidth: "272px",
} as const;

// ── Transitions ───────────────────────────────────────────────────────────────
export const transitions = {
  duration: "0.15s",
  easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  default: "0.15s cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

// ── Aggregated export ─────────────────────────────────────────────────────────
export const tokens = {
  accent,
  dark: darkColors,
  light: lightColors,
  semantic: semanticColors,
  modules: moduleColors,
  fonts,
  fontWeights,
  radius,
  shadows,
  layout,
  transitions,
} as const;

export type Tokens = typeof tokens;
