import ChartCard from '../components/ChartCard'
import RevenueLine from '../components/RevenueLine'
import TopSkusBar from '../components/TopSkusBar'
import CategorySalesBar from '../components/CategorySalesBar'

export default function Dashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <ChartCard title="Revenue (last 30 days)">
        <RevenueLine days={30} />
      </ChartCard>

      <ChartCard title="Top SKUs (last 60 days)">
        <TopSkusBar days={60} limit={10} />
      </ChartCard>

      <ChartCard title="Category Sales (last 60 days)">
        <CategorySalesBar days={60} />
      </ChartCard>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="mb-2 text-sm font-medium text-slate-300">Welcome</h3>
        <p className="text-slate-400 text-sm">
          Live analytics powered by your Express API + MySQL.
        </p>
      </div>
    </div>
  )
}
