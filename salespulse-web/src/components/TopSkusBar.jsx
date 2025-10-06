import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend
} from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function TopSkusBar({ days = 60, limit = 10 }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['top-skus', days, limit],
    queryFn: async () => (await api.get(`/kpis/top-skus?days=${days}&limit=${limit}`)).data,
  })

  if (isLoading) return <div className="text-slate-400">Loading…</div>
  if (error)     return <div className="text-red-400">Failed to load.</div>

  const labels = data.map(d => d.sku)
  const units = data.map(d => d.units)

  const chartData = {
    labels,
    datasets: [{
      label: 'Units sold',
      data: units,
    }]
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // horizontal bars (looks nice for top lists)
    scales: { x: { beginAtZero: true } },
    plugins: { legend: { display: false } }
  }

  return <Bar data={chartData} options={options} />
}
