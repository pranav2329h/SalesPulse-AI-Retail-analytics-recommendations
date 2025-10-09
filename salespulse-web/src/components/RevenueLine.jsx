import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, Filler } from 'chart.js'
import 'chartjs-adapter-date-fns'
import { SkeletonCard } from './Skeletons'
import Loader from './Loader'

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, Filler)

export default function RevenueLine({ days = 30 }) {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['revenue', days],
    queryFn: async () => (await api.get(`/kpis/revenue-by-day?days=${days}`)).data,
  })

  if (isLoading) return <SkeletonCard lines={8} />
  if (error)     return <div className="text-red-400">Failed to load.</div>

  const labels = data.map(d => d.day)
  const values = data.map(d => d.revenue)

  const chartData = {
    labels,
    datasets: [{ label: 'Revenue', data: values, fill: true, tension: 0.35 }]
  }
  const options = {
    responsive: true, maintainAspectRatio: false,
    elements: { point: { radius: 3, hoverRadius: 5 } },
    scales: {
      x: { type: 'time', time: { unit: 'day' }, grid: { display: false } },
      y: { beginAtZero: true }
    },
    plugins: { legend: { display: false } }
  }

  return (
    <div className="relative h-full">
      {isFetching && (
        <div className="pointer-events-none absolute right-3 top-3">
          <Loader size={18} />
        </div>
      )}
      <Line data={chartData} options={options} />
    </div>
  )
}
