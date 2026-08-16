'use client'

import { useState } from 'react'
import { RotateCw, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react'

interface DSAProblemDue {
  id: string
  title: string
  problemUrl?: string | null
  topic: string
  difficulty: string
  confidence: number
  nextRevisionDate?: string | null
  revisedCount?: number
}

interface SpacedRepetitionWidgetProps {
  dueProblems: DSAProblemDue[]
  onRevisionDone: () => void
}

export function SpacedRepetitionWidget({ dueProblems, onRevisionDone }: SpacedRepetitionWidgetProps) {
  const [revisingId, setRevisingId] = useState<string | null>(null)

  const handleMarkRevised = async (id: string) => {
    setRevisingId(id)
    try {
      const res = await fetch(`/api/dsa/${id}/revise`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        onRevisionDone()
      }
    } catch (err) {
      console.error('Failed to mark revised:', err)
    } finally {
      setRevisingId(null)
    }
  }

  if (dueProblems.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">Spaced Repetition Clear</h3>
            <p className="text-[11px] text-neutral-400">All solved DSA problems are up to date! Great retention effort.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <RotateCw className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
            Spaced Repetition Engine
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-extrabold">
              {dueProblems.length} Due Today
            </span>
          </h3>
        </div>
        <span className="text-[10px] text-neutral-400 font-medium hidden sm:inline">
          Memory interval system active
        </span>
      </div>

      <div className="space-y-2">
        {dueProblems.slice(0, 3).map((problem) => (
          <div
            key={problem.id}
            className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between gap-3"
          >
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white truncate">{problem.title}</span>
                {problem.problemUrl && (
                  <a
                    href={problem.problemUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-neutral-400 hover:text-emerald-400 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-medium">
                <span className="text-emerald-400 font-semibold">{problem.topic}</span>
                <span>•</span>
                <span>Confidence: {problem.confidence}/5</span>
                <span>•</span>
                <span>Revised: {problem.revisedCount || 0}x</span>
              </div>
            </div>

            <button
              onClick={() => handleMarkRevised(problem.id)}
              disabled={revisingId === problem.id}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold transition-colors shrink-0 flex items-center gap-1 shadow-sm"
            >
              {revisingId === problem.id ? (
                <RotateCw className="w-3 h-3 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3 h-3" />
              )}
              Mark Revised
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
