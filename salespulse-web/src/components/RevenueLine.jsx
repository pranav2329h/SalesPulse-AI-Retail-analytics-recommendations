import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, Filler
} from 'chart.js'
import 'chartjs-adapter-date-fns'

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, Filler)

export default function RevenueLine({ days = 30 }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['revenue', days],
    queryFn: async () => (await api.get(`/kpis/revenue-by-day?days=${days}`)).data,
  })

  if (isLoading) return <div className="text-slate-400">Loading…</div>
  if (error)     return <div className="text-red-400">Failed to load.</div>

  const labels = data.map(d => d.day)
  const values = data.map(d => d.revenue)

  const chartData = {
    labels,
    datasets: [{
      label: 'Revenue',
      data: values,
      fill: true,
      tension: 0.35,
    }]
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { type: 'time', time: { unit: 'day' }, grid: { display: false } },
      y: { beginAtZero: true, ticks: { callback: v => `₹${v}` } }
    },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => `₹${ctx.parsed.y.toLocaleString()}` } }
    }
  }

  return <Line data={chartData} options={options} />
}
