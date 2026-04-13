"use client";

import { useState } from "react";
import { SearchDialog } from "@/components/search/search-dialog";

export function HubSearchButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full max-w-xl items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-left text-muted-foreground shadow-sm transition-all duration-150 hover:border-primary/50 hover:shadow-md"
        aria-label="Suche öffnen"
      >
        {/* Search icon */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 shrink-0 text-muted-foreground/70"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <span className="flex-1 text-base">Suche in Regulatorik, Formaten, Ländern …</span>
        <kbd className="flex items-center gap-0.5 rounded-lg border border-border bg-muted/60 px-2 py-1 font-mono text-xs text-muted-foreground">
          <span>⌘</span>
          <span>K</span>
        </kbd>
      </button>
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
