import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import 'chartjs-adapter-date-fns'

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, Filler)

export default function RevenueLine({ days = 30, title = 'Revenue' }) {
  const q = useQuery({
    queryKey: ['revenue-by-day', days],
    queryFn: async () => (await api.get(`/kpis/revenue-by-day?days=${days}`)).data
  })

  if (q.isLoading) return <div className="muted">Loading…</div>
  if (q.error) return <div style={{ color: '#ef4444' }}>Failed to load</div>

  const rows = Array.isArray(q.data) ? q.data : []
  if (rows.length === 0) return <div className="muted">No revenue in the selected range.</div>

  const labels = rows.map(r => r?.day)
  const values = rows.map(r => Number(r?.revenue ?? 0))

  // ✅ Always a plain object with datasets array
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        fill: true,
        backgroundColor: 'rgba(79,70,229,0.15)',
        borderColor: '#4f46e5',
        pointRadius: 2.5,
        pointHoverRadius: 5,
        tension: 0.35
      }
    ]
  }

  const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 900, easing: 'easeOutQuart' },
  hover: { mode: 'nearest', intersect: false },
  plugins: {
    legend: { display: false, labels: { color: '#000' } },
    tooltip: { mode: 'index', intersect: false, titleColor:'#000', bodyColor:'#000' }
  },
  scales: {
    x: { type: 'time', time: { unit: 'day' }, ticks: { color:'#000' }, grid: { color:'rgba(0,0,0,0.08)' }, border: { color:'rgba(0,0,0,0.12)'} },
    y: { beginAtZero: true, ticks: { color:'#000' }, grid: { color:'rgba(0,0,0,0.08)' }, border: { color:'rgba(0,0,0,0.12)'} }
  }
}

  return <Line data={chartData} options={options} />
}
