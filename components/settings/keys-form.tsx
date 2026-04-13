"use client"

import { useState, useEffect, useCallback } from "react"

interface KeyStatus {
  anthropic: boolean
  openai: boolean
}

interface TestResult {
  anthropic: "ok" | "error"
  openai: "ok" | "error"
  errors?: Record<string, string>
}

function EyeIcon({ show }: { show: boolean }) {
  if (show) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function StatusBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
      active
        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        : "bg-muted text-muted-foreground"
    }`}>
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-muted-foreground/50"}`} />
      {label}: {active ? "gespeichert" : "nicht gesetzt"}
    </span>
  )
}

export function KeysForm() {
  const [anthropicKey, setAnthropicKey] = useState("")
  const [openaiKey, setOpenaiKey] = useState("")
  const [showAnth, setShowAnth] = useState(false)
  const [showOai, setShowOai] = useState(false)
  const [status, setStatus] = useState<KeyStatus>({ anthropic: false, openai: false })
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/settings/keys")
      if (res.ok) {
        const data = await res.json()
        setStatus(data)
      }
    } catch {
      // silent
    }
  }, [])

  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  const handleSave = async () => {
    if (!anthropicKey && !openaiKey) {
      showMessage("error", "Bitte mindestens einen API-Key eingeben.")
      return
    }
    setSaving(true)
    try {
      const body: Record<string, string> = {}
      if (anthropicKey) body.anthropicKey = anthropicKey
      if (openaiKey) body.openaiKey = openaiKey

      const res = await fetch("/api/settings/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        showMessage("success", "API-Keys wurden verschlüsselt gespeichert.")
        setAnthropicKey("")
        setOpenaiKey("")
        await fetchStatus()
      } else {
        showMessage("error", "Fehler beim Speichern.")
      }
    } catch {
      showMessage("error", "Netzwerkfehler.")
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const res = await fetch("/api/settings/keys/test", { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        setTestResult(data)
      } else {
        showMessage("error", data.error ?? "Fehler beim Testen.")
      }
    } catch {
      showMessage("error", "Netzwerkfehler.")
    } finally {
      setTesting(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    setTestResult(null)
    try {
      const res = await fetch("/api/settings/keys", { method: "DELETE" })
      if (res.ok) {
        showMessage("success", "API-Keys wurden gelöscht.")
        await fetchStatus()
      } else {
        showMessage("error", "Fehler beim Löschen.")
      }
    } catch {
      showMessage("error", "Netzwerkfehler.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Status */}
      <div className="flex flex-wrap gap-2">
        <StatusBadge label="Anthropic" active={status.anthropic} />
        <StatusBadge label="OpenAI" active={status.openai} />
      </div>

      {/* Inline message */}
      {message && (
        <div className={`rounded-lg border px-4 py-3 text-sm ${
          message.type === "success"
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
            : "border-destructive/30 bg-destructive/10 text-destructive"
        }`}>
          {message.text}
        </div>
      )}

      {/* Form */}
      <div className="space-y-4">
        {/* Anthropic Key */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground" htmlFor="anthropic-key">
            Anthropic API-Key
          </label>
          <p className="text-xs text-muted-foreground">
            Erhältlich unter{" "}
            <a
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              console.anthropic.com
            </a>
          </p>
          <div className="relative">
            <input
              id="anthropic-key"
              type={showAnth ? "text" : "password"}
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              placeholder={status.anthropic ? "••••••••••••••••••••• (gespeichert)" : "sk-ant-..."}
              className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 pr-10 text-sm font-mono text-foreground placeholder:text-muted-foreground/60 focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              onClick={() => setShowAnth((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showAnth ? "Key verbergen" : "Key anzeigen"}
            >
              <EyeIcon show={showAnth} />
            </button>
          </div>
        </div>

        {/* OpenAI Key */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground" htmlFor="openai-key">
            OpenAI API-Key
          </label>
          <p className="text-xs text-muted-foreground">
            Erhältlich unter{" "}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              platform.openai.com
            </a>
          </p>
          <div className="relative">
            <input
              id="openai-key"
              type={showOai ? "text" : "password"}
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder={status.openai ? "••••••••••••••••••••• (gespeichert)" : "sk-proj-..."}
              className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 pr-10 text-sm font-mono text-foreground placeholder:text-muted-foreground/60 focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              onClick={() => setShowOai((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showOai ? "Key verbergen" : "Key anzeigen"}
            >
              <EyeIcon show={showOai} />
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Speichern..." : "Speichern"}
        </button>
        <button
          onClick={handleTest}
          disabled={testing || (!status.anthropic && !status.openai)}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {testing ? "Teste..." : "Verbindung testen"}
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting || (!status.anthropic && !status.openai)}
          className="rounded-lg border border-destructive/40 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleting ? "Löschen..." : "Keys löschen"}
        </button>
      </div>

      {/* Test results */}
      {testResult && (
        <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Testergebnis</p>
          <div className="space-y-1.5">
            {(["anthropic", "openai"] as const).map((key) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                <span className={`h-2 w-2 rounded-full ${testResult[key] === "ok" ? "bg-emerald-500" : "bg-destructive"}`} />
                <span className="font-medium capitalize">{key}:</span>
                <span className={testResult[key] === "ok" ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}>
                  {testResult[key] === "ok" ? "Verbindung erfolgreich" : "Fehler"}
                </span>
                {testResult.errors?.[key] && (
                  <span className="text-xs text-muted-foreground truncate max-w-xs" title={testResult.errors[key]}>
                    — {testResult.errors[key]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
