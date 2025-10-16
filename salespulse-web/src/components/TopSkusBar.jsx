import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function TopSkusBar({ days = 60, limit = 10 }) {
  const q = useQuery({
    queryKey: ['top-skus', days, limit],
    queryFn: async () => (await api.get(`/kpis/top-skus?days=${days}&limit=${limit}`)).data
  })

  if (q.isLoading) return <div className="muted">Loading…</div>
  if (q.error) return <div style={{color:'#ef4444'}}>Failed to load</div>

  const rows = Array.isArray(q.data) ? q.data : []
  if (rows.length === 0) return <div className="muted">No SKUs found.</div>

  const data = {
    labels: rows.map(r => r?.sku ?? r?.name ?? 'SKU'),
    datasets: [{ label: 'Units sold', data: rows.map(r => Number(r?.units ?? 0)), backgroundColor: '#4f46e5' }]
  }
  const options = {
    responsive: true, maintainAspectRatio: false, indexAxis: 'y',
    animation: { duration: 800, easing: 'easeOutQuart' },
    scales: { x: { beginAtZero: true }, y: { grid: { display: false } } },
    plugins: { legend: { display: false } }
  }
  return <Bar data={data} options={options} />
}
