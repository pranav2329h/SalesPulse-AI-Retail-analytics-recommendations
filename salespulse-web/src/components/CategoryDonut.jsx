import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)

export default function CategoryDonut({ days = 60 }) {
  const q = useQuery({
    queryKey: ['category-sales', days],
    queryFn: async () => (await api.get(`/kpis/category-sales?days=${days}`)).data
  })

  if (q.isLoading) return <div className="muted">Loading…</div>
  if (q.error) return <div style={{color:'#ef4444'}}>Failed to load</div>

  const rows = Array.isArray(q.data) ? q.data : []
  if (rows.length === 0) return <div className="muted">No category revenue.</div>

  const labels = rows.map(r => r?.category ?? 'Uncategorized')
  const revenue = rows.map(r => Number(r?.revenue ?? 0))
  const bg = ['#4f46e5','#8b5cf6','#22c55e','#f59e0b','#ef4444','#06b6d4','#a3e635','#f472b6','#10b981']

  const data = { labels, datasets: [{ data: revenue, backgroundColor: labels.map((_,i)=> bg[i%bg.length]) }] }
  const options = {
    responsive: true, maintainAspectRatio: false, cutout: '60%',
    animation: { duration: 900, easing: 'easeOutQuart' },
    plugins: { legend: { position: 'bottom' } }
  }
  return <Doughnut data={data} options={options} />
}
