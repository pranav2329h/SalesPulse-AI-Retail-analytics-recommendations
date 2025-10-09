import GlassCard from './GlassCard'

export default function ChartCard({ title, children, right }) {
  return (
    <GlassCard className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-100">{title}</h3>
        {right}
      </div>
      <div className="h-72">{children}</div>
    </GlassCard>
  )
}
