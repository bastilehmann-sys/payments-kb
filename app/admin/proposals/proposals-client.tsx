'use client';

import { useState } from 'react';
import type { ProposalWithItems, ProposalItem } from '@/lib/queries/proposals';

interface Props {
  initialProposals: ProposalWithItems[];
}

export function ProposalsClient({ initialProposals }: Props) {
  const [proposals, setProposals] = useState(initialProposals);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  async function patchItem(proposalId: string, itemId: string, patch: { status?: string; comment?: string }) {
    await fetch(`/api/admin/proposals/${proposalId}/items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
  }

  async function saveComments(proposal: ProposalWithItems) {
    for (const item of proposal.items) {
      const comment = comments[item.id];
      if (comment !== undefined) {
        await patchItem(proposal.id, item.id, { comment });
      }
    }
  }

  async function requestRevision(proposal: ProposalWithItems) {
    setLoading(l => ({ ...l, [`revise-${proposal.id}`]: true }));
    try {
      await saveComments(proposal);
      await fetch(`/api/admin/proposals/${proposal.id}/revise`, { method: 'POST' });
      const res = await fetch('/api/admin/proposals');
      setProposals(await res.json());
    } finally {
      setLoading(l => ({ ...l, [`revise-${proposal.id}`]: false }));
    }
  }

  async function executeApproved(proposal: ProposalWithItems) {
    setLoading(l => ({ ...l, [`execute-${proposal.id}`]: true }));
    try {
      await fetch(`/api/admin/proposals/${proposal.id}/execute`, { method: 'POST' });
      const res = await fetch('/api/admin/proposals');
      setProposals(await res.json());
    } finally {
      setLoading(l => ({ ...l, [`execute-${proposal.id}`]: false }));
    }
  }

  async function confirmItem(proposal: ProposalWithItems, itemId: string) {
    setLoading(l => ({ ...l, [`confirm-${itemId}`]: true }));
    try {
      await fetch(`/api/admin/proposals/${proposal.id}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_ids: [itemId] }),
      });
      const res = await fetch('/api/admin/proposals');
      setProposals(await res.json());
    } finally {
      setLoading(l => ({ ...l, [`confirm-${itemId}`]: false }));
    }
  }

  async function toggleStatus(proposal: ProposalWithItems, item: ProposalItem, status: 'approved' | 'rejected' | 'pending') {
    setLoading(l => ({ ...l, [`toggle-${item.id}`]: true }));
    try {
      const next = item.status === status ? 'pending' : status;
      await patchItem(proposal.id, item.id, { status: next });
      const res = await fetch('/api/admin/proposals');
      setProposals(await res.json());
    } finally {
      setLoading(l => ({ ...l, [`toggle-${item.id}`]: false }));
    }
  }

  if (proposals.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Noch keine Proposals. Der Agent läuft montags um 08:00.
      </p>
    );
  }

  return (
    <div className="space-y-12">
      {proposals.map(proposal => {
        const hasComments = proposal.items.some(item => comments[item.id] || item.comment);
        const hasApproved = proposal.items.some(
          item => item.status === 'approved' && !item.generated_content
        );

        return (
          <div key={proposal.id} className="border border-border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-muted/40 border-b border-border">
              <div>
                <span className="font-medium text-sm">KW {getKW(proposal.week_date)}</span>
                <span className="text-muted-foreground text-xs ml-2">
                  {proposal.items.length} Proposals · {proposal.status}
                </span>
              </div>
              <div className="flex gap-2">
                {hasComments && (
                  <button
                    onClick={() => requestRevision(proposal)}
                    disabled={loading[`revise-${proposal.id}`]}
                    className="text-xs px-3 py-1.5 rounded border border-border hover:bg-accent disabled:opacity-50"
                  >
                    {loading[`revise-${proposal.id}`] ? 'Überarbeite…' : 'Revision anfragen'}
                  </button>
                )}
                {hasApproved && (
                  <button
                    onClick={() => executeApproved(proposal)}
                    disabled={loading[`execute-${proposal.id}`]}
                    className="text-xs px-3 py-1.5 rounded bg-foreground text-background hover:opacity-90 disabled:opacity-50"
                  >
                    {loading[`execute-${proposal.id}`] ? 'Generiere…' : 'Approved ausführen'}
                  </button>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-border">
              {proposal.items.map(item => (
                <div key={item.id} className="px-5 py-4 space-y-3">
                  {/* Topic + target */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-sm">{item.topic}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.target_file === 'new' ? 'Neues Land anlegen' : item.target_file}
                        {item.target_section && ` › ${item.target_section}`}
                      </p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => toggleStatus(proposal, item, 'approved')}
                        className={`text-xs px-2.5 py-1 rounded border ${item.status === 'approved' ? 'bg-green-600 text-white border-green-600' : 'border-border hover:bg-accent'}`}
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => toggleStatus(proposal, item, 'rejected')}
                        className={`text-xs px-2.5 py-1 rounded border ${item.status === 'rejected' ? 'bg-red-600 text-white border-red-600' : 'border-border hover:bg-accent'}`}
                      >
                        ✗
                      </button>
                    </div>
                  </div>

                  {/* Reasoning + sources */}
                  <p className="text-xs text-muted-foreground">{item.reasoning}</p>
                  <div className="flex flex-wrap gap-2">
                    {(item.sources as Array<{ title: string; url: string; date: string }>).map((src, i) => (
                      <a
                        key={i}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs underline text-muted-foreground hover:text-foreground"
                      >
                        {src.title} ({src.date})
                      </a>
                    ))}
                  </div>

                  {/* Outline */}
                  <pre className="text-xs bg-muted/40 rounded p-3 whitespace-pre-wrap font-mono leading-relaxed">
                    {item.content_outline}
                  </pre>

                  {/* Comment */}
                  {item.status !== 'executed' && item.status !== 'rejected' && (
                    <textarea
                      placeholder="Kommentar (z.B. 'Nicht Australien, lieber Kanada')"
                      defaultValue={item.comment ?? ''}
                      onChange={e => setComments(c => ({ ...c, [item.id]: e.target.value }))}
                      rows={2}
                      className="w-full text-xs rounded border border-border bg-background px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  )}

                  {/* Generated content review */}
                  {item.generated_content && item.status === 'approved' && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-amber-600">Generierter Inhalt — bitte prüfen:</p>
                      <pre className="text-xs bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded p-3 whitespace-pre-wrap font-mono leading-relaxed max-h-64 overflow-y-auto">
                        {item.generated_content}
                      </pre>
                      <button
                        onClick={() => confirmItem(proposal, item.id)}
                        disabled={loading[`confirm-${item.id}`]}
                        className="text-xs px-3 py-1.5 rounded bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50"
                      >
                        {loading[`confirm-${item.id}`] ? 'Reindex läuft…' : 'Reindex bestätigen'}
                      </button>
                    </div>
                  )}

                  {item.status === 'executed' && (
                    <p className="text-xs text-green-600 font-medium">✓ Ausgeführt und reindexiert</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getKW(dateStr: string): number {
  const date = new Date(dateStr);
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / 86_400_000);
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}
