import { useEffect, useMemo, useState } from 'react'
import { Line, Doughnut, Bar } from 'react-chartjs-2'

// 🔒 Local, safe Chart.js registration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import 'chartjs-adapter-date-fns'

import { fetchJSON } from '../lib/fetchJSON'
import './style.css'

// Guard so we don't double-register during hot reload
if (!ChartJS._spRegistered) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Filler,
    Tooltip,
    Legend
  )
  ChartJS._spRegistered = true
}

export default function Dashboard() {
  const [revByDay, setRevByDay] = useState([])
  const [catSales, setCatSales] = useState([])
  const [topSkus, setTopSkus] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setErr('')
      try {
        const [r, c, t] = await Promise.all([
          fetchJSON('/kpis/revenue-by-day?days=60'),
          fetchJSON('/kpis/category-sales?days=60'),
          fetchJSON('/kpis/top-skus?days=60&limit=10')
        ])

        setRevByDay(Array.isArray(r) ? r : [])
        setCatSales(Array.isArray(c) ? c : [])
        setTopSkus(Array.isArray(t) ? t : [])
      } catch (e) {
        setErr(e.message || 'Failed to load dashboard data')
        setRevByDay([])
        setCatSales([])
        setTopSkus([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // ---------- DATASETS ----------

  const revenueData = useMemo(() => ({
    responsive: true,
    labels: revByDay.map(d => d.day),
    datasets: [
      {
        label: 'Revenue',
        data: revByDay.map(d => Number(d.revenue || 0)),
        borderColor: '#2a6efb',
        backgroundColor: 'rgba(42,110,251,0.25)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#2a6efb',
        pointBorderColor: '#2a6efb',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 3,
      }
    ]
  }), [revByDay])

  const catData = useMemo(() => ({
    labels: catSales.map(c => c.category),
    datasets: [
      {
        data: catSales.map(c => Number(c.revenue || 0)),
        backgroundColor: [
          '#2a6efb',
          '#6a11cb',
          '#ff6b6b',
          '#00bfa6',
          '#fbbf24',
          '#10b981'
        ],
        borderColor: 'rgba(255,255,255,0.8)',
        borderWidth: 2,
        hoverOffset: 10
      }
    ]
  }), [catSales])

  const topSkuData = useMemo(() => ({
    labels: topSkus.map(s => s.sku),
    datasets: [
      {
        label: 'Quantity',
        data: topSkus.map(s => Number(s.quantity || 0)),
        backgroundColor: '#1e3a8a',
        borderColor: 'rgba(255,255,255,0.4)',
        borderWidth: 1,
        hoverBorderWidth: 2,
        hoverBorderColor: '#ffffff',
        hoverBackgroundColor: '#2a6efb'
      }
    ]
  }), [topSkus])

  // ---------- SHARED OPTIONS (white text, dark tooltip, hover glow) ----------

  const commonScales = {
    x: {
      ticks: { color: '#ffffff' },
      grid: { color: 'rgba(255,255,255,0.15)' }
    },
    y: {
      ticks: { color: '#ffffff' },
      grid: { color: 'rgba(255,255,255,0.15)' }
    }
  }

  const commonPlugins = {
    legend: {
      labels: {
        color: '#ffffff'
      }
    },
    tooltip: {
      backgroundColor: 'rgba(5,5,10,0.9)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: 'rgba(255,255,255,0.2)',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 10,
      displayColors: true
    }
  }

  // line / bar share similar opts
  const lineOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
  duration: 1000,
  easing: 'easeOutQuart',
  delay(ctx) {
    return ctx.dataIndex * 60; // sequential element delay
  },
},
    interaction: {
      mode: 'nearest',
      intersect: true
    },
    scales: commonScales,
    plugins: {
      ...commonPlugins,
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 8,
        backgroundColor: '#2a6efb',
        borderColor: '#2a6efb',
        borderWidth: 2,
        hoverBackgroundColor: '#ffffff',
        hoverBorderColor: '#ffffff',
        hoverBorderWidth: 3,
      },
      line: {
        tension: 0.3,
        borderWidth: 2,
        borderColor: '#2a6efb',
        fill: true,
        backgroundColor: 'rgba(42,110,251,0.25)',
      }
    }
  }), [])

  const barOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 600,
      easing: 'easeOutQuart'
    },
    interaction: {
      mode: 'nearest',
      intersect: true
    },
    scales: commonScales,
    plugins: {
      ...commonPlugins
    }
  }), [])

  const doughnutOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 600,
      easing: 'easeOutQuart'
    },
    plugins: {
      ...commonPlugins
    },
    elements: {
      arc: {
        hoverOffset: 10,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.8)'
      }
    }
  }), [])

  // ---------- KPI TOTAL ----------
  const totalRev = revByDay
    .reduce((a, b) => a + Number(b.revenue || 0), 0)
    .toLocaleString('en-IN')

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      {err && <div className="alert error glass">{err}</div>}

      {loading ? (
        <div className="skeleton">Loading charts…</div>
      ) : (
        <>
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-label">Total Revenue</div>
              <div className="kpi-value">₹{totalRev}</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">Top Category</div>
              <div className="kpi-value">
                {catSales[0]?.category || '—'}
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">Top SKU</div>
              <div className="kpi-value">
                {topSkus[0]?.sku || '—'}
              </div>
            </div>
          </div>

          <div className="chart-grid">
            <div className="chart-card">
              <h3>Revenue by Day</h3>
              <div style={{ height: '240px' }}>
                <Line data={revenueData} options={lineOptions} />
              </div>
            </div>

            <div className="chart-card">
              <h3>Revenue by Category</h3>
              <div style={{ height: '240px' }}>
                <Doughnut data={catData} options={doughnutOptions} />
              </div>
            </div>

            <div className="chart-card full">
              <h3>Top SKUs</h3>
              <div style={{ height: '260px' }}>
                <Bar data={topSkuData} options={barOptions} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
