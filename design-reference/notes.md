# Design Reference — learning.norinit.de

## Visual Language Summary

**Dark-first.** The platform uses a deep navy dark theme as its primary mode (`#0a0e17` background). There is no explicit light-mode stylesheet — all surfaces layer upward from `#0a0e17` → `#0f1420` → `#151a28` → `#1e2538`.

**Minimal, with purposeful color accents.** The UI is clean and structured. Color is reserved for the single SAP green accent (`#86bc25`) and per-module color chips. Everything else is grayscale navy.

**Sans-serif, modern typeface pairing.**
- Headings: **Syne** (geometric, strong personality — used for display/titles)
- Body: **Outfit** (clean, readable, slightly rounded letterforms)
- Mono: **JetBrains Mono** / Fira Code (code blocks, SAP field names)

**Airy, not dense.** Standard Tailwind spacing unit (0.25rem). Cards have visible breathing room. No cramped information density.

**Slightly rounded, not bubbly.** Border radii top out at `1rem` (2xl). Cards and panels use `lg` (0.5rem) or `xl` (0.75rem). Not pill-shaped — functional and professional.

**Subtle elevation system.** Four surface layers using dark navy shades. Borders are low-opacity white overlays (`rgba(255,255,255,0.06–0.12)`). No heavy drop-shadows — elevation is conveyed by background lightness stepping.

**Accent glow effects.** The green accent has matching glow variants used for hover/focus states and decorative glows on hero elements (`box-shadow: 0 0 24px rgba(134,188,37,0.12)`).

**Per-module color system.** Each learning module has a distinct accent color (blue, cyan, purple, red, orange, teal) used for module cards and progress indicators.

## Key Decisions for payments-kb

1. Adopt **dark-first** with `class="dark"` on `<html>` as default.
2. Use `Syne` for `--font-heading`, `Outfit` for `--font-sans`, `JetBrains Mono` for `--font-mono`.
3. Map shadcn tokens: `--background` → `#0a0e17`, `--card` → `#151a28`, `--primary` → `#86bc25`.
4. Keep radius modest: `--radius: 0.5rem` (maps shadcn `lg` to 0.5rem).
5. Module colors → chart tokens for data visualizations.
