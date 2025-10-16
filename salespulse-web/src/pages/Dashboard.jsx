import ChartCard from '../components/ChartCard'
import RevenueLine from '../components/RevenueLine'
import TopSkusBar from '../components/TopSkusBar'
import CategorySalesBar from '../components/CategorySalesBar'
import CumulativeRevenueLine from '../components/CumulativeRevenueLine'
import CategoryDonut from '../components/CategoryDonut'
import SafeBoundary from '../components/SafeBoundary'
import Reveal from '../components/Reveal'

export default function Dashboard() {
  return (
    <div className="grid">
      <div className="card pad">
        <h2 className="h2" style={{marginBottom:6, color:'#111'}}>Dashboard</h2>
        <p className="muted">Realtime sales analytics from your MySQL data.</p>
      </div>

      <div className="grid grid-2">
        <Reveal mode="fade-up" delay={0}>
          <SafeBoundary>
            <ChartCard title="Revenue (last 30 days)">
              <RevenueLine days={30} />
            </ChartCard>
          </SafeBoundary>
        </Reveal>

        <Reveal mode="fade-up" delay={80}>
          <SafeBoundary>
            <ChartCard title="Cumulative Revenue (last 60 days)">
              <CumulativeRevenueLine days={60} />
            </ChartCard>
          </SafeBoundary>
        </Reveal>

        <Reveal mode="zoom-in" delay={120}>
          <SafeBoundary>
            <ChartCard title="Top SKUs (last 60 days)">
              <TopSkusBar days={60} limit={10} />
            </ChartCard>
          </SafeBoundary>
        </Reveal>

        <Reveal mode="zoom-in" delay={160}>
          <SafeBoundary>
            <ChartCard title="Category Sales (last 60 days)">
              <CategorySalesBar days={60} />
            </ChartCard>
          </SafeBoundary>
        </Reveal>

        <Reveal mode="fade-up" delay={200}>
          <SafeBoundary>
            <ChartCard title="Category Share">
              <CategoryDonut days={60} />
            </ChartCard>
          </SafeBoundary>
        </Reveal>
      </div>
    </div>
  )
}
