import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend
} from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function CategorySalesBar({ days = 60 }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['category-sales', days],
    queryFn: async () => (await api.get(`/kpis/category-sales?days=${days}`)).data,
  })

  if (isLoading) return <div className="text-slate-400">Loading…</div>
  if (error)     return <div className="text-red-400">Failed to load.</div>

  const labels = data.map(d => d.category)
  const revenue = data.map(d => d.revenue)

  const chartData = {
    labels,
    datasets: [{
      label: 'Revenue',
      data: revenue,
    }]
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, ticks: { callback: v => `₹${v}` } }
    },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => `₹${ctx.parsed.y.toLocaleString()}` } }
    }
  }

  return <Bar data={chartData} options={options} />
}
