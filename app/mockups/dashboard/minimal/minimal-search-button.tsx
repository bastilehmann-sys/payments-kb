"use client";

import { useState } from "react";
import { SearchDialog } from "@/components/search/search-dialog";

export function MinimalSearchButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full max-w-lg items-center gap-3 rounded-2xl border border-border bg-background px-5 py-4 text-left text-muted-foreground shadow-md transition-all duration-150 hover:border-primary/50 hover:shadow-lg"
        aria-label="Suche öffnen"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 shrink-0 text-muted-foreground/60"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <span className="flex-1 text-base">Suche …</span>
        <kbd className="flex items-center gap-0.5 rounded-lg border border-border bg-muted/60 px-2 py-1 font-mono text-xs text-muted-foreground">
          <span>⌘</span>
          <span>K</span>
        </kbd>
      </button>
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
