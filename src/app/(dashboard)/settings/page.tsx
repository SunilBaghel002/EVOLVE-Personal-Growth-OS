'use client'

import { useState } from 'react'
import { Settings, Download, Trash2, ShieldAlert, User, CheckCircle2, Loader2 } from 'lucide-react'

export default function SettingsPage() {
  const [isExporting, setIsExporting] = useState(false)
  const [resetConfirmInput, setResetConfirmInput] = useState('')
  const [isResetting, setIsResetting] = useState(false)
  const [resetMessage, setResetMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleExportData = async () => {
    setIsExporting(true)
    try {
      const res = await fetch('/api/settings/export')
      if (!res.ok) throw new Error('Export failed')

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `EVOLVE_Backup_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export error:', err)
      alert('Failed to download export file')
    } finally {
      setIsExporting(false)
    }
  }

  const handleResetData = async (e: React.FormEvent) => {
    e.preventDefault()
    if (resetConfirmInput !== 'RESET DATA') {
      setErrorMessage('Please type "RESET DATA" exactly to confirm reset.')
      return
    }

    setIsResetting(true)
    setErrorMessage('')
    setResetMessage('')

    try {
      const res = await fetch('/api/settings/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmText: resetConfirmInput }),
      })

      const result = await res.json()
      if (!res.ok || !result.success) {
        throw new Error(result.error?.message || 'Failed to reset data')
      }

      setResetMessage('User tracking data has been safely reset.')
      setResetConfirmInput('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error resetting data'
      setErrorMessage(msg)
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-400" />
          System Settings & Data Management
        </h1>
        <p className="text-xs text-neutral-400">
          Manage user profile, 1-click JSON backup export, and database reset controls.
        </p>
      </div>

      {/* Profile Card */}
      <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Sunil Baghel</h2>
            <p className="text-xs text-neutral-400">Personal Growth OS — 21-Day Evolution Challenge</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
            <span className="text-neutral-500 block text-[10px] font-semibold uppercase">Target MVP Date</span>
            <span className="font-bold text-white">17 Aug 2026</span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
            <span className="text-neutral-500 block text-[10px] font-semibold uppercase">Target Challenge Hours</span>
            <span className="font-bold text-emerald-400">231 Hours</span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
            <span className="text-neutral-500 block text-[10px] font-semibold uppercase">App Target</span>
            <span className="font-bold text-sky-400">105 Applications</span>
          </div>
        </div>
      </div>

      {/* Data Export Card */}
      <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-sky-400" />
              Backup & Export Data (JSON)
            </h2>
            <p className="text-xs text-neutral-400 max-w-lg">
              Download a complete JSON export of all your Applications, DSA problem logs, Daily reflection logs, MERN revision progress, and Interview questions.
            </p>
          </div>
          <button
            onClick={handleExportData}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-2 shrink-0 disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Export JSON Backup
          </button>
        </div>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-4">
        <div className="flex items-center gap-2 text-rose-400">
          <ShieldAlert className="w-5 h-5" />
          <h2 className="text-sm font-bold text-white">Danger Zone: Reset User Data</h2>
        </div>
        <p className="text-xs text-neutral-400">
          This action will delete all custom tracking records (Applications, DSA logs, Daily Logs, and Goals) from the database. Type <strong className="text-rose-400 font-mono">RESET DATA</strong> below to confirm.
        </p>

        {resetMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {resetMessage}
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleResetData} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="text"
            placeholder="Type RESET DATA to confirm"
            value={resetConfirmInput}
            onChange={(e) => setResetConfirmInput(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-hidden focus:border-rose-500 flex-1"
          />
          <button
            type="submit"
            disabled={isResetting || resetConfirmInput !== 'RESET DATA'}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            {isResetting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <Trash2 className="w-4 h-4" />
            Confirm Data Reset
          </button>
        </form>
      </div>
    </div>
  )
}
