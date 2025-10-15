import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function TopSkusBar({ days = 60, limit = 10 }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['top-skus', days, limit],
    queryFn: async () => (await api.get(`/kpis/top-skus?days=${days}&limit=${limit}`)).data
  })

  if (isLoading) return <div className="muted">Loading…</div>
  if (error) return <div style={{color:'#ef4444'}}>Failed to load</div>
  if (!data?.length) return <div className="muted">No SKUs found.</div>

  const labels = data.map(d => `${d.sku}`)
  const units = data.map(d => Number(d.units || 0))

  const chartData = {
    labels,
    datasets: [{ label: 'Units sold', data: units }]
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    scales: {
      x: { beginAtZero: true },
      y: { grid: { display: false } },
    },
    plugins: { legend: { display: false } }
  }

  return <Bar data={chartData} options={options} />
}
