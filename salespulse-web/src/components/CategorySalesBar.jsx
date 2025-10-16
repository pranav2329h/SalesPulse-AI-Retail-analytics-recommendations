import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function CategorySalesBar({ days = 60 }) {
  const q = useQuery({
    queryKey: ['category-sales', days],
    queryFn: async () => (await api.get(`/kpis/category-sales?days=${days}`)).data
  })

  if (q.isLoading) return <div className="muted">Loading…</div>
  if (q.error) return <div style={{color:'#ef4444'}}>Failed to load</div>

  const rows = Array.isArray(q.data) ? q.data : []
  if (rows.length === 0) return <div className="muted">No category revenue.</div>

  const data = {
    labels: rows.map(r => r?.category ?? 'Uncategorized'),
    datasets: [{ label: 'Revenue', data: rows.map(r => Number(r?.revenue ?? 0)), backgroundColor: '#8b5cf6' }]
  }
  const options = {
    responsive: true, maintainAspectRatio: false,
    animation: { duration: 800, easing: 'easeOutQuart' },
    scales: { y: { beginAtZero: true }, x: { grid: { display: false } } },
    plugins: { legend: { display: false } }
  }
  return <Bar data={data} options={options} />
}
