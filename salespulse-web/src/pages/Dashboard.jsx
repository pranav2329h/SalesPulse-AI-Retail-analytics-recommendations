import ChartCard from '../components/ChartCard'
import RevenueLine from '../components/RevenueLine'

export default function Dashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <ChartCard title="Revenue (last 30 days)">
        <RevenueLine days={90} />
      </ChartCard>
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="mb-2 text-sm font-medium text-slate-300">Welcome</h3>
        <p className="text-slate-400 text-sm">
          This dashboard reads from your Express API and renders Chart.js via react-chartjs-2.
        </p>
      </div>
    </div>
  )
}
