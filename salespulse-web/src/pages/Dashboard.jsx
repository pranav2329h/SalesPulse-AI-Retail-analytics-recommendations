import ChartCard from '../components/ChartCard'
import RevenueLine from '../components/RevenueLine'
import TopSkusBar from '../components/TopSkusBar'
import CategorySalesBar from '../components/CategorySalesBar'

export default function Dashboard() {
  return (
    <div className="grid">
      <div className="card pad">
        <h2 className="h2">Dashboard</h2>
        <p className="muted">Realtime sales analytics from your MySQL data.</p>
      </div>

      <div className="grid grid-2">
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
