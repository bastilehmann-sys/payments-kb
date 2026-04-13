export interface NavItem {
  label: string
  href: string
  /** SVG path data (24×24 viewBox) */
  iconPath: string
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    iconPath:
      "M3 9.5L12 3l9 6.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5zM9 22V12h6v10",
  },
  {
    label: "Regulatorik",
    href: "/regulatorik",
    iconPath:
      "M12 2a10 10 0 100 20A10 10 0 0012 2zm0 2v8l5.5 3.18-.72 1.25L11 13.27V4h1z",
  },
  {
    label: "Formate",
    href: "/formate",
    iconPath:
      "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8 13h8v1.5H8V13zm0 3h8v1.5H8V16zm0-6h4v1.5H8V10z",
  },
  {
    label: "Clearing",
    href: "/clearing",
    iconPath:
      "M4 6h16M4 10h16M4 14h10M17 14l2 2 4-4",
  },
  {
    label: "IHB / POBO",
    href: "/ihb",
    iconPath:
      "M2 20h20M4 20V10l8-7 8 7v10M10 20v-6h4v6",
  },
  {
    label: "Länder",
    href: "/laender",
    iconPath:
      "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z",
  },
  {
    label: "Changelog",
    href: "/changelog",
    iconPath:
      "M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z",
  },
]
