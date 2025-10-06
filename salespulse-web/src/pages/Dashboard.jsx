import ChartCard from '../components/ChartCard'
import RevenueLine from '../components/RevenueLine'
import TopSkusBar from '../components/TopSkusBar'
import CategorySalesBar from '../components/CategorySalesBar'
import MotionCard from '../components/MotionCard'

export default function Dashboard() {
  return (
    <div className="grid gap-6">
      <MotionCard className="p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Dashboard</h2>
            <p className="text-slate-400 text-sm">Realtime sales analytics powered by MySQL + Express</p>
          </div>
        </div>
      </MotionCard>

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
      </div>
    </div>
  )
}
