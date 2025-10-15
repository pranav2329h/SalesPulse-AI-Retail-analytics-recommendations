import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, Filler } from 'chart.js'
import 'chartjs-adapter-date-fns'

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, Filler)

export default function RevenueLine({ days = 30 }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['revenue-by-day', days],
    queryFn: async () => (await api.get(`/kpis/revenue-by-day?days=${days}`)).data
  })

  if (isLoading) return <div className="muted">Loading…</div>
  if (error) return <div style={{color:'#ef4444'}}>Failed to load</div>
  if (!data?.length) return <div className="muted">No revenue in the selected range.</div>

  const labels = data.map(d => d.day)
  const values = data.map(d => Number(d.revenue || 0))

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
    elements: { point: { radius: 3, hoverRadius: 5 } },
    scales: {
      x: { type: 'time', time: { unit: 'day' }, grid: { display: false } },
      y: { beginAtZero: true }
    },
    plugins: { legend: { display: false } }
  }

  return <Line data={chartData} options={options} />
}
