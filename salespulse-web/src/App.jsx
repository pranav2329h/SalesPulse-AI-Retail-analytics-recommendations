import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'

import Register from './pages/Register'
import Login from './pages/Login'
import Products from './pages/Products'

import { revenueByDay, topSkus, categorySales } from './lib/api'

import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend
} from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend)

const inr = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(n || 0))

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

  const revenueLine = useMemo(() => ({
    labels: revData.map(r => r.day),
    datasets: [{ label: 'Revenue (₹)', data: revData.map(r => Number(r.revenue || 0)), borderWidth: 2, tension: 0.2, pointRadius: 2 }]
  }), [revData])

  const topSkusBar = useMemo(() => ({
    labels: skuData.map(x => x.sku),
    datasets: [{ label: 'Revenue (₹)', data: skuData.map(x => Number(x.revenue || 0)), borderWidth: 1 }]
  }), [skuData])

  const categoryPie = useMemo(() => ({
    labels: catData.map(x => x.category ?? 'Uncategorized'),
    datasets: [{ label: 'Revenue (₹)', data: catData.map(x => Number(x.revenue || 0)) }]
  }), [catData])

  if (loading) return <div className="container"><p>Loading dashboard…</p></div>
  if (err) return <div className="container"><p className="error">Error: {err}</p></div>

  const totalRevenue = revData.reduce((s, r) => s + Number(r.revenue || 0), 0)
  const bestSku = skuData[0]?.sku ?? '—'
  const bestCat = catData[0]?.category ?? '—'

  return (
    <div className="container">
      <h2>Dashboard</h2>

      <div className="grid grid-auto" style={{ marginBottom: 12 }}>
        <div className="card">
          <h4 className="help" style={{ margin: 0 }}>Total Revenue (60d)</h4>
          <div style={{ marginTop: 6, fontSize: 22, fontWeight: 700 }}>{inr(totalRevenue)}</div>
        </div>
        <div className="card">
          <h4 className="help" style={{ margin: 0 }}>Top SKU</h4>
          <div style={{ marginTop: 6, fontSize: 22, fontWeight: 700 }}>{bestSku}</div>
        </div>
        <div className="card">
          <h4 className="help" style={{ margin: 0 }}>Top Category</h4>
          <div style={{ marginTop: 6, fontSize: 22, fontWeight: 700 }}>{bestCat}</div>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <b>Revenue by Day (Last 60 days)</b>
          <Line data={revenueLine} options={{
            responsive: true,
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => inr(ctx.parsed.y) } } },
            scales: { y: { ticks: { callback: (v) => inr(v) } } }
          }} />
        </div>

        <div className="grid grid-2">
          <div className="card">
            <b>Top SKUs by Revenue</b>
            <Bar data={topSkusBar} options={{
              responsive: true,
              plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => inr(ctx.parsed.y) } } },
              scales: { y: { ticks: { callback: (v) => inr(v) } } }
            }} />
          </div>
          <div className="card">
            <b>Category Sales (Revenue)</b>
            <Doughnut data={categoryPie} options={{
              responsive: true,
              plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${inr(ctx.parsed)}` } } }
            }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <nav className="nav">
        <NavLink to="/" end className={({isActive}) => isActive ? 'active' : undefined}>Dashboard</NavLink>
        <NavLink to="/products" className={({isActive}) => isActive ? 'active' : undefined}>Products</NavLink>
        <div style={{ marginLeft:'auto', display:'flex', gap:12 }}>
          <NavLink to="/register" className={({isActive}) => isActive ? 'active' : undefined}>Register</NavLink>
          <NavLink to="/login" className={({isActive}) => isActive ? 'active' : undefined}>Login</NavLink>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}
