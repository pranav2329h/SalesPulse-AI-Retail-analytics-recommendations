import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'

// pages
import Register from './pages/Register'
import Login from './pages/Login'
import Products from './pages/Products'

// API
import { revenueByDay, topSkus, categorySales } from './lib/api'

// Charts
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Tooltip, Legend
} from 'chart.js'

// Register chart.js components once
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Tooltip, Legend
)

// Currency helper
const inr = (n) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 0
}).format(Number(n || 0))

// Common chart options (nice defaults + colors that fit the theme)
const commonChartOpts = {
  responsive: true,
  animation: { duration: 900, easing: 'easeInOutCubic' },
  hover: { mode: 'nearest', intersect: true },
  plugins: {
    legend: {
      labels: { color: '#cfe0ff', usePointStyle: true, pointStyle: 'circle' }
    },
    tooltip: {
      backgroundColor: 'rgba(12,16,28,.95)',
      borderColor: 'rgba(255,255,255,.1)',
      borderWidth: 1,
      titleColor: '#eaf0ff',
      bodyColor: '#cfe0ff',
    }
  },
  scales: {
    x: { ticks: { color: '#b8c9ee' }, grid: { color: 'rgba(255,255,255,.06)' } },
    y: { ticks: { color: '#b8c9ee', callback: v => inr(v) }, grid: { color: 'rgba(255,255,255,.06)' } }
  }
}

function Dashboard() {
  const [revData, setRevData] = useState([])
  const [skuData, setSkuData] = useState([])
  const [catData, setCatData] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const [rev, skus, cats] = await Promise.all([
          revenueByDay(60), topSkus(60, 10), categorySales(60)
        ])
        setRevData(rev.data || [])
        setSkuData(skus.data || [])
        setCatData(cats.data || [])
      } catch (e) {
        setErr(e?.response?.data?.error || 'Failed to load KPIs')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // Build datasets
  const revenueLine = useMemo(() => ({
    labels: revData.map(r => r.day),
    datasets: [{
      label: 'Revenue (₹)',
      data: revData.map(r => Number(r.revenue || 0)),
      borderWidth: 2,
      pointRadius: 2,
      tension: 0.25
    }]
  }), [revData])

  const topSkusBar = useMemo(() => ({
    labels: skuData.map(x => x.sku),
    datasets: [{
      label: 'Revenue (₹)',
      data: skuData.map(x => Number(x.revenue || 0)),
      borderWidth: 1
    }]
  }), [skuData])

  const categoryPie = useMemo(() => ({
    labels: catData.map(x => x.category ?? 'Uncategorized'),
    datasets: [{
      label: 'Revenue (₹)',
      data: catData.map(x => Number(x.revenue || 0))
    }]
  }), [catData])

  if (loading) return (
    <div className="container">
      <div className="skeleton" />
      <div className="grid grid-2 mt-2">
        <div className="skeleton" />
        <div className="skeleton" />
      </div>
    </div>
  )
  if (err) return <div className="container"><p className="error">Error: {err}</p></div>

  const totalRevenue = revData.reduce((s, r) => s + Number(r.revenue || 0), 0)
  const bestSku = skuData[0]?.sku ?? '—'
  const bestCat = catData[0]?.category ?? '—'

  return (
    <div className="container">
      <div className="row mb-2">
        <div className="h1">Dashboard</div>
        <span className="right badge glow">Live</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-auto mb-2">
        <div className="card kpi">
          <span className="help">Total Revenue (60d)</span>
          <div className="h2">{inr(totalRevenue)}</div>
        </div>
        <div className="card kpi">
          <span className="help">Top SKU</span>
          <div className="h2">{bestSku}</div>
        </div>
        <div className="card kpi">
          <span className="help">Top Category</span>
          <div className="h2">{bestCat}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid">
        <div className="card chart chart-entrance">
          <div className="row mb-1">
            <b>Revenue by Day (Last 60 days)</b>
            <div className="right">
              <button className="icon-btn" title="Refresh" onClick={() => window.location.reload()}>
                ⟳
              </button>
            </div>
          </div>
          <Line data={revenueLine} options={commonChartOpts} />
        </div>

        <div className="grid grid-2">
          <div className="card chart chart-entrance">
            <b>Top SKUs by Revenue</b>
            <Bar data={topSkusBar} options={commonChartOpts} />
          </div>

          <div className="card chart chart-entrance">
            <b>Category Sales (Revenue)</b>
            <Doughnut data={categoryPie} options={{ ...commonChartOpts, cutout: '58%' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      {/* NAV */}
      <nav className="nav">
        <NavLink to="/" end className={({isActive}) => isActive ? 'active' : undefined}>Dashboard</NavLink>
        <NavLink to="/products" className={({isActive}) => isActive ? 'active' : undefined}>Products</NavLink>
        <div className="spacer" />
        <NavLink to="/register" className={({isActive}) => isActive ? 'active' : undefined}>Register</NavLink>
        <NavLink to="/login" className={({isActive}) => isActive ? 'active' : undefined}>Login</NavLink>
      </nav>

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}
