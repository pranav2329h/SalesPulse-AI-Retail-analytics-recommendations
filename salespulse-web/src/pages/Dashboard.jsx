import ChartCard from '../components/ChartCard'
import RevenueLine from '../components/RevenueLine'
import TopSkusBar from '../components/TopSkusBar'
import CategorySalesBar from '../components/CategorySalesBar'
import GlassCard from '../components/GlassCard'

export default function Dashboard() {
  return (
    <div className="grid gap-6">
      <GlassCard className="p-6">
        <h2 className="text-2xl font-bold tracking-tight text-white">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-400">
          Realtime sales analytics powered by MySQL + Express
        </p>
      </GlassCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Revenue (last 30 days)">
          <RevenueLine days={30} />
        </ChartCard>

        <ChartCard title="Top SKUs (last 60 days)">
          <TopSkusBar days={60} limit={10} />
        </ChartCard>

        <ChartCard title="Category Sales (last 60 days)">
          <CategorySalesBar days={60} />
        </ChartCard>
      </div>
    </div>
  )
}
