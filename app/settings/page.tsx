import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { KeysForm } from "@/components/settings/keys-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Einstellungen — Payments KB",
}

interface Props {
  searchParams: Promise<{ reason?: string }>
}

export default async function SettingsPage({ searchParams }: Props) {
  const session = await auth()
  if (!session) redirect("/login")

  const { reason } = await searchParams
  const missingKeys = reason === "missing-keys"

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Einstellungen</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          API-Keys werden AES-256-GCM verschlüsselt als httpOnly-Cookie gespeichert. Sie verlassen nie den Server unverschlüsselt.
        </p>
      </div>

      {missingKeys && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
          <strong>API-Keys erforderlich:</strong> Bitte trage deine Anthropic- und OpenAI-Keys ein, bevor du fortfährst.
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-5 font-heading text-base font-semibold text-foreground">API-Keys</h2>
        <KeysForm />
      </div>
    </div>
  )
}
