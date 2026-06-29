-- Migration 0015: fix badges as text[], add phase_nr unique constraint
-- badges was jsonb in 0014; drop and re-add as text[] (table is empty at this point)
ALTER TABLE "technik_entries" DROP COLUMN "badges";
--> statement-breakpoint
ALTER TABLE "technik_entries" ADD COLUMN "badges" text[] DEFAULT '{}';
--> statement-breakpoint
ALTER TABLE "sap_implementation_phases" ADD CONSTRAINT "sap_implementation_phases_phase_nr_unique" UNIQUE("phase_nr");
