import MotionCard from './MotionCard'
export default function ChartCard({ title, children, right }) {
  return (
    <MotionCard>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
        {right}
      </div>
      <div className="h-72">{children}</div>
    </MotionCard>
  )
}
