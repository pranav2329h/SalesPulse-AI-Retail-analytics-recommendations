import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { SkeletonCard } from './Skeletons'
import Loader from './Loader'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function TopSkusBar({ days = 60, limit = 10 }) {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['top-skus', days, limit],
    queryFn: async () => (await api.get(`/kpis/top-skus?days=${days}&limit=${limit}`)).data,
  })

  if (isLoading) return <SkeletonCard lines={6} />
  if (error)     return <div style={{color:'var(--danger)'}}>Failed to load.</div>

  const labels = data.map(d => d.sku)
  const units = data.map(d => d.units)

  const chartData = { labels, datasets: [{ label: 'Units sold', data: units }] }
  const options = {
    responsive: true, maintainAspectRatio: false, indexAxis: 'y',
    scales: { x: { beginAtZero: true }, y: { grid: { display: false } } },
    plugins: { legend: { display: false } }
  }

  return (
    <div className="chart-body" style={{position:'relative'}}>
      {isFetching && <div style={{position:'absolute', right:10, top:10}}><Loader size={18}/></div>}
      <Bar data={chartData} options={options} />
    </div>
  )
}
