export default function ChartCard({ title, children, right }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-300">{title}</h3>
        {right}
      </div>
      <div className="h-72">{children}</div>
    </div>
  )
}
