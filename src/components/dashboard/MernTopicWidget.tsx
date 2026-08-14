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
      <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">MERN Topic of the Day</h3>
          </div>
          <Link href="/mern" className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold">
            <span>View MERN Checklist</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-4 rounded-xl bg-neutral-800/40 border border-neutral-800 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="text-xs font-bold text-white">All MERN Revision Topics Mastered!</p>
            <p className="text-[11px] text-neutral-400">Great job completing your 21 MERN revision modules.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">MERN Topic of the Day</h3>
        </div>
        <Link href="/mern" className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold">
          <span>Go to MERN</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
            {topic.category}
          </span>
          <span className="text-[11px] text-neutral-400 font-medium">Topic #{topic.order}</span>
        </div>

        <h4 className="text-sm font-bold text-white">{topic.title}</h4>

        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-neutral-400">Confidence Level:</span>
          <span className="font-bold text-amber-400">{topic.confidence || 1} / 5 Stars</span>
        </div>
      </div>
    </div>
  )
}
