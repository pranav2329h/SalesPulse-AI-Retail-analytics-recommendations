import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns'
import { Chart as ChartJS } from 'chart.js/auto'

export default function CumulativeRevenueLine({ days = 60 }) {
  const q = useQuery({
    queryKey: ['revenue-by-day', days],
    queryFn: async () => (await api.get(`/kpis/revenue-by-day?days=${days}`)).data
  })

  if (q.isLoading) return <div className="muted">Loading…</div>
  if (q.error) return <div style={{color:'#ef4444'}}>Failed to load</div>

  const rows = Array.isArray(q.data) ? q.data : []
  if (rows.length === 0) return <div className="muted">No revenue in the selected range.</div>

  let running = 0
  const data = {
    labels: rows.map(r => r?.day),
    datasets: [{
      label: 'Cumulative Revenue',
      data: rows.map(r => (running += Number(r?.revenue ?? 0))),
      fill: false,
      borderColor: '#22c55e',
      tension: 0.35,
      pointRadius: 0,
    }]
  }
  const options = {
    responsive: true, maintainAspectRatio: false,
    animation: { duration: 900, easing: 'easeOutQuart' },
    plugins: { legend: { display: false } },
    scales: { x: { type:'time', time:{unit:'day'}, grid:{display:false} }, y: { beginAtZero:true } }
  }
  return <Line data={data} options={options} />
}
