import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { SkeletonCard } from './Skeletons'
import Loader from './Loader'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function CategorySalesBar({ days = 60 }) {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['category-sales', days],
    queryFn: async () => (await api.get(`/kpis/category-sales?days=${days}`)).data,
  })

  if (isLoading) return <SkeletonCard lines={6} />
  if (error)     return <div className="text-red-400">Failed to load.</div>

  const labels = data.map(d => d.category)
  const revenue = data.map(d => d.revenue)

  const chartData = { labels, datasets: [{ label: 'Revenue', data: revenue }] }
  const options = {
    responsive: true, maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, ticks: { callback: v => `₹${v}` } },
      x: { grid: { display: false } }
    },
    plugins: { legend: { display: false } }
  }

  return (
    <div className="relative h-full">
      {isFetching && <div className="absolute right-3 top-3"><Loader size={18} /></div>}
      <Bar data={chartData} options={options} />
    </div>
  )
}
