'use client'

import Link from 'next/link'
import { Code, ArrowRight, CheckCircle } from 'lucide-react'
import type { MERNTopicEntry } from '@/types'

interface MernTopicWidgetProps {
  topic: MERNTopicEntry | null
}

export function MernTopicWidget({ topic }: MernTopicWidgetProps) {
  if (!topic) {
    return (
      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">MERN Topic of the Day</h3>
          </div>
          <Link href="/mern" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold">
            <span>View MERN Checklist</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-800/40 border border-slate-200 dark:border-neutral-800 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">All MERN Revision Topics Mastered!</p>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400">Great job completing your 21 MERN revision modules.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">MERN Topic of the Day</h3>
        </div>
        <Link href="/mern" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold">
          <span>Go to MERN</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-800/50 border border-slate-200 dark:border-neutral-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
            {topic.category}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-neutral-400 font-semibold">Topic #{topic.order}</span>
        </div>

        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{topic.title}</h4>

        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-slate-500 dark:text-neutral-400">Confidence Level:</span>
          <span className="font-bold text-amber-600 dark:text-amber-400">{topic.confidence || 1} / 5 Stars</span>
        </div>
      </div>
    </div>
  )
}
