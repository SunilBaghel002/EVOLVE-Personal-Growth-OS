import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">System Settings</h1>
        <p className="text-xs text-neutral-400">Manage user profile, data exports, and app preferences.</p>
      </div>

      <div className="p-12 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
          <Settings className="w-6 h-6" />
        </div>
        <h2 className="text-base font-semibold text-white">Settings & Preferences</h2>
        <p className="text-xs text-neutral-400 max-w-sm mx-auto">
          Profile settings and backup export options.
        </p>
      </div>
    </div>
  )
}
