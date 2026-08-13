interface ApplicationDetailPageProps {
  params: {
    id: string
  }
}

export default function ApplicationDetailPage({ params }: ApplicationDetailPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Application Detail</h1>
        <p className="text-xs text-neutral-400">Application ID: {params.id}</p>
      </div>

      <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-300">
        Detailed view and interview rounds tracker for application {params.id}.
      </div>
    </div>
  )
}
