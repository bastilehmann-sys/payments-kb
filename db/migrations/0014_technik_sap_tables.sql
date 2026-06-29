-- Custom SQL migration: technik_entries, sap_roadmap_items, sap_implementation_phases
-- Generated manually due to non-TTY environment

CREATE TABLE IF NOT EXISTS "technik_entries" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "subtitle" text,
  "category" text NOT NULL,
  "badges" jsonb DEFAULT '[]'::jsonb,
  "einsatzgebiet" text,
  "sicherheit" text,
  "verbreitung" text,
  "sap_integration" text,
  "version_aktuell" text,
  "formate" text[] DEFAULT '{}',
  "alternativen" text[] DEFAULT '{}',
  "komplexitaet" integer,
  "tags" text[] DEFAULT '{}',
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "sap_roadmap_items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" text NOT NULL,
  "description" text,
  "release_date" text,
  "status" text DEFAULT 'planned' NOT NULL,
  "tags" text[] DEFAULT '{}',
  "sort_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "sap_implementation_phases" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "phase_nr" integer NOT NULL,
  "title" text NOT NULL,
  "description" text,
  "color" text NOT NULL,
  "md_anchor" text,
  "created_at" timestamp with time zone DEFAULT now()
);
