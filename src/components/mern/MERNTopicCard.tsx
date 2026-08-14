'use client'

import { useState } from 'react'
import { Check, Star, FileText, ChevronDown, ChevronUp, Save, Clock } from 'lucide-react'
import type { MERNTopicEntry } from '@/types'

interface MERNTopicCardProps {
  topic: MERNTopicEntry
  onToggleComplete: (id: string, completed: boolean) => void
  onUpdateConfidence: (id: string, confidence: number) => void
  onSaveNotes: (id: string, notes: string) => void
}

export function MERNTopicCard({
  topic,
  onToggleComplete,
  onUpdateConfidence,
  onSaveNotes,
}: MERNTopicCardProps) {
  const [isNotesOpen, setIsNotesOpen] = useState(false)
  const [notesText, setNotesText] = useState(topic.notes || '')
  const [isSavingNotes, setIsSavingNotes] = useState(false)

  const handleSaveNotes = async () => {
    setIsSavingNotes(true)
    await onSaveNotes(topic.id, notesText)
    setIsSavingNotes(false)
  }

  const categoryColorMap: Record<string, { bg: string; text: string; border: string }> = {
    MongoDB: { bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-500/20' },
    Express: { bg: 'bg-purple-500/10', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-500/20' },
    React: { bg: 'bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-500/20' },
    Node: { bg: 'bg-amber-500/10', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-500/20' },
  }

  const catStyle = categoryColorMap[topic.category] || categoryColorMap['MongoDB']

  const formattedLastRevised = topic.lastRevisedAt
    ? new Date(topic.lastRevisedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null

  return (
    <div
      className={`p-4 rounded-2xl border transition-all duration-200 ${
        topic.completed
          ? 'bg-slate-50/60 dark:bg-neutral-900/40 border-emerald-500/40 dark:border-emerald-500/30 shadow-xs'
          : 'bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 shadow-sm'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Checkbox & Topic Details */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <button
            type="button"
            onClick={() => onToggleComplete(topic.id, !topic.completed)}
            className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center border transition-all shrink-0 ${
              topic.completed
                ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-xs'
                : 'bg-white dark:bg-neutral-800 border-slate-300 dark:border-neutral-700 text-transparent hover:border-emerald-500'
            }`}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </button>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border uppercase tracking-wider ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
              >
                {topic.category}
              </span>
              <span
                className={`text-xs font-bold leading-snug line-clamp-2 ${
                  topic.completed
                    ? 'line-through text-slate-400 dark:text-neutral-500'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                {topic.title}
              </span>
            </div>

            {formattedLastRevised && (
              <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-neutral-500 font-medium">
                <Clock className="w-3 h-3" />
                <span>Revised {formattedLastRevised}</span>
              </div>
            )}
          </div>
        </div>

        {/* Confidence Stars & Actions */}
        <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
          {/* Confidence Rating (1-5 Stars) */}
          <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-neutral-800/80 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-neutral-700/60">
            {[1, 2, 3, 4, 5].map((starVal) => {
              const isFilled = starVal <= (topic.confidence || 1)
              return (
                <button
                  key={starVal}
                  type="button"
                  onClick={() => onUpdateConfidence(topic.id, starVal)}
                  className="p-0.5 hover:scale-110 transition-transform"
                  title={`Set confidence level ${starVal}/5`}
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      isFilled
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 dark:text-neutral-600'
                    }`}
                  />
                </button>
              )
            })}
          </div>

          {/* Notes Toggle Button */}
          <button
            type="button"
            onClick={() => setIsNotesOpen(!isNotesOpen)}
            className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-xl border transition-colors ${
              topic.notes
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                : 'bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 border-slate-200 dark:border-neutral-700 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Notes</span>
            {isNotesOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Expandable Notes Area */}
      {isNotesOpen && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-neutral-800 space-y-2 animate-in fade-in duration-150">
          <textarea
            rows={3}
            value={notesText}
            onChange={(e) => setNotesText(e.target.value)}
            placeholder="Add key revision notes, interview questions, or code snippets for this topic..."
            className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 font-medium resize-none"
          />
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={handleSaveNotes}
              disabled={isSavingNotes}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-all disabled:opacity-50"
            >
              <Save className="w-3 h-3" />
              <span>{isSavingNotes ? 'Saving...' : 'Save Notes'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
