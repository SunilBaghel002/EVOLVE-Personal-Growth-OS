import { Flame } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <Flame className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-white tracking-tight">Welcome to EVOLVE</h1>
          <p className="text-xs text-neutral-400">Personal Growth OS for Sunil Baghel</p>
        </div>
        <div className="pt-4">
          <button
            type="button"
            className="w-full py-3 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  )
}
