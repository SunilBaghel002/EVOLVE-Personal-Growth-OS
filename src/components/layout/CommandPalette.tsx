'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, ArrowRight } from 'lucide-react'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

interface SearchItem {
  id: string
  title: string
  subtitle: string
  category: 'Page' | 'Application' | 'DSA' | 'Question'
  url: string
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchItem[]>([])
  const [loading, setLoading] = useState(false)

  const pages: SearchItem[] = [
    { id: 'p1', title: 'Dashboard', subtitle: 'Today summary & quick metrics', category: 'Page', url: '/' },
    { id: 'p2', title: 'Applications Tracker', subtitle: 'Job applications pipeline', category: 'Page', url: '/applications' },
    { id: 'p3', title: 'DSA Tracker', subtitle: 'LeetCode & algorithm practice log', category: 'Page', url: '/dsa' },
    { id: 'p4', title: 'Daily Logs', subtitle: 'Reflection & study hours logger', category: 'Page', url: '/logs' },
    { id: 'p5', title: 'MERN Revision', subtitle: 'Full-stack revision checklist', category: 'Page', url: '/mern' },
    { id: 'p6', title: 'Analytics & Insights', subtitle: 'Progress trends and funnel charts', category: 'Page', url: '/analytics' },
    { id: 'p7', title: 'Weekly Goals', subtitle: 'Challenge targets & Sunday ritual', category: 'Page', url: '/goals' },
    { id: 'p8', title: 'Interview Bank & Rounds', subtitle: 'Question bank & schedule', category: 'Page', url: '/interviews' },
    { id: 'p9', title: 'Settings', subtitle: 'User profile & JSON data export', category: 'Page', url: '/settings' },
  ]

  const handleGlobalSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSearchResults([])
      return
    }

    setLoading(true)
    try {
      const [appRes, dsaRes, qRes] = await Promise.all([
        fetch(`/api/applications?search=${encodeURIComponent(q)}`),
        fetch(`/api/dsa?search=${encodeURIComponent(q)}`),
        fetch(`/api/questions?search=${encodeURIComponent(q)}`),
      ])

      const apps = await appRes.json()
      const dsas = await dsaRes.json()
      const qns = await qRes.json()

      const results: SearchItem[] = []

      if (apps.success && Array.isArray(apps.data)) {
        apps.data.slice(0, 4).forEach((app: { id: string; companyName: string; role: string; status: string }) => {
          results.push({
            id: `app-${app.id}`,
            title: `${app.companyName} — ${app.role}`,
            subtitle: `Status: ${app.status}`,
            category: 'Application',
            url: '/applications',
          })
        })
      }

      if (dsas.success && Array.isArray(dsas.data)) {
        dsas.data.slice(0, 4).forEach((dsa: { id: string; title: string; topic: string; difficulty: string }) => {
          results.push({
            id: `dsa-${dsa.id}`,
            title: dsa.title,
            subtitle: `${dsa.topic} (${dsa.difficulty})`,
            category: 'DSA',
            url: '/dsa',
          })
        })
      }

      if (qns.success && Array.isArray(qns.data)) {
        qns.data.slice(0, 4).forEach((qItem: { id: string; question: string; category: string }) => {
          results.push({
            id: `q-${qItem.id}`,
            title: qItem.question,
            subtitle: `Category: ${qItem.category}`,
            category: 'Question',
            url: '/interviews',
          })
        })
      }

      setSearchResults(results)
    } catch (err) {
      console.error('Command Palette search error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      handleGlobalSearch(query)
    }, 200)
    return () => clearTimeout(timer)
  }, [query, handleGlobalSearch])

  if (!isOpen) return null

  const handleSelect = (url: string) => {
    router.push(url)
    onClose()
  }

  const filteredPages = query.trim()
    ? pages.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : pages

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-neutral-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command, page name, or search keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder:text-neutral-500 focus:outline-hidden"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-3">
          {/* Direct Page Navigation */}
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-500 px-3 block mb-1">
              Pages & Navigation
            </span>
            <div className="space-y-1">
              {filteredPages.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.url)}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-neutral-800/80 transition-colors flex items-center justify-between group"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-neutral-400">{item.subtitle}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Records Search Results */}
          {query.trim() && (
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-500 px-3 block mb-1">
                Data Search Results {loading && '(searching...)'}
              </span>
              {searchResults.length === 0 && !loading ? (
                <p className="text-xs text-neutral-500 px-3 py-2">No matching records found.</p>
              ) : (
                <div className="space-y-1">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.url)}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-neutral-800/80 transition-colors flex items-center justify-between group"
                    >
                      <div className="space-y-0.5 min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded-md bg-neutral-800 text-[9px] font-extrabold text-sky-400 uppercase">
                            {item.category}
                          </span>
                          <p className="text-xs font-bold text-white truncate">{item.title}</p>
                        </div>
                        <p className="text-[11px] text-neutral-400 truncate">{item.subtitle}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-emerald-400 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-950/50 flex items-center justify-between text-[11px] text-neutral-500">
          <span>Press ESC or click backdrop to close</span>
          <span className="font-mono text-neutral-400">Cmd + K / Ctrl + K</span>
        </div>
      </div>
    </div>
  )
}
