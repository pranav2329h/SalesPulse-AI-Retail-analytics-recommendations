import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function CategorySalesBar({ days = 60 }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['category-sales', days],
    queryFn: async () => (await api.get(`/kpis/category-sales?days=${days}`)).data
  })

  if (isLoading) return <div className="muted">Loading…</div>
  if (error) return <div style={{color:'#ef4444'}}>Failed to load</div>
  if (!data?.length) return <div className="muted">No category revenue.</div>

  const labels = data.map(d => d.category || 'Uncategorized')
  const revenue = data.map(d => Number(d.revenue || 0))

  const chartData = {
    labels,
    datasets: [{ label: 'Revenue', data: revenue }]
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true },
      x: { grid: { display: false } },
    },
    plugins: { legend: { display: false } }
  }

  return <Bar data={chartData} options={options} />
}
