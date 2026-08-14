'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'

interface DSADeleteModalProps {
  isOpen: boolean
  title: string
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DSADeleteModal({
  isOpen,
  title,
  isDeleting,
  onClose,
  onConfirm,
}: DSADeleteModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-5 shadow-2xl">
        <div className="flex items-center gap-3 text-red-400">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Delete DSA Problem</h3>
            <p className="text-xs text-neutral-400">This action cannot be undone.</p>
          </div>
        </div>

        <p className="text-sm text-neutral-300 leading-relaxed">
          Are you sure you want to delete <strong className="text-white font-semibold">{title}</strong> from your solved problem list?
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Problem</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
