import { BookOpenCheck } from 'lucide-react'

export default function MERNPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">MERN Revision Checklist</h1>
        <p className="text-xs text-neutral-400">Track topic-wise revision for MongoDB, Express.js, React, and Node.js.</p>
      </div>

      <div className="p-12 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
          <BookOpenCheck className="w-6 h-6" />
        </div>
        <h2 className="text-base font-semibold text-white">21 MERN Topics Revision</h2>
        <p className="text-xs text-neutral-400 max-w-sm mx-auto">
          Checklist tracking across 4 core categories to ensure complete interview readiness.
        </p>
      </div>
    </div>
  )
}
