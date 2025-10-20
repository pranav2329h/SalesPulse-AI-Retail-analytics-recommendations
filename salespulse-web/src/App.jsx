import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'

// pages you already created earlier
import Register from './pages/Register'
import Login from './pages/Login'
import Products from './pages/Products'

// API helpers
import { revenueByDay, topSkus, categorySales } from './lib/api'

// Charts
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

// Register chart.js pieces
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
)

// Simple currency formatter (₹)
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
          revenueByDay(60),           // last 60 days
          topSkus(60, 10),            // top 10 SKUs
          categorySales(60),          // by category
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

  // Chart data transforms
  const revenueLine = useMemo(() => {
    const labels = revData.map(r => r.day) // "YYYY-MM-DD"
    const values = revData.map(r => Number(r.revenue || 0))
    return {
      labels,
      datasets: [
        {
          label: 'Revenue (₹)',
          data: values,
          borderWidth: 2,
          tension: 0.2,
          pointRadius: 2
        }
      ]
    }
  }, [revData])

  const topSkusBar = useMemo(() => {
    const labels = skuData.map(x => x.sku)
    const values = skuData.map(x => Number(x.revenue || 0))
    return {
      labels,
      datasets: [
        { label: 'Revenue (₹)', data: values, borderWidth: 1 }
      ]
    }
  }, [skuData])

  const categoryPie = useMemo(() => {
    const labels = catData.map(x => x.category ?? 'Uncategorized')
    const values = catData.map(x => Number(x.revenue || 0))
    return {
      labels,
      datasets: [
        { label: 'Revenue (₹)', data: values }
      ]
    }
  }, [catData])

  if (loading) return <p style={{padding:12}}>Loading dashboard…</p>
  if (err) return <p style={{padding:12, color:'crimson'}}>Error: {err}</p>

  const totalRevenue = revData.reduce((sum, r) => sum + Number(r.revenue || 0), 0)
  const bestSku = skuData[0]?.sku ?? '—'
  const bestCat = catData[0]?.category ?? '—'

  return (
    <div style={{ padding: 12 }}>
      <h2>Dashboard</h2>

      {/* KPI cards */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:12, marginBottom:12}}>
        <div style={cardStyle}>
          <h4 style={cardTitle}>Total Revenue (60d)</h4>
          <div style={cardValue}>{inr(totalRevenue)}</div>
        </div>
        <div style={cardStyle}>
          <h4 style={cardTitle}>Top SKU</h4>
          <div style={cardValue}>{bestSku}</div>
        </div>
        <div style={cardStyle}>
          <h4 style={cardTitle}>Top Category</h4>
          <div style={cardValue}>{bestCat}</div>
        </div>
      </div>

      {/* Charts */}
      <div style={{display:'grid', gridTemplateColumns:'1fr', gap:16}}>
        <div style={chartCardStyle}>
          <div style={chartHeader}><b>Revenue by Day (Last 60 days)</b></div>
          <Line data={revenueLine} options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: { callbacks: { label: (ctx) => inr(ctx.parsed.y) } }
            },
            scales: {
              y: { ticks: { callback: (v) => inr(v) } }
            }
          }} />
        </div>

        <div style={chartRow}>
          <div style={chartCardStyle}>
            <div style={chartHeader}><b>Top SKUs by Revenue</b></div>
            <Bar data={topSkusBar} options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (ctx) => inr(ctx.parsed.y) } }
              },
              scales: {
                y: { ticks: { callback: (v) => inr(v) } }
              }
            }} />
          </div>

          <div style={chartCardStyle}>
            <div style={chartHeader}><b>Category Sales (Revenue)</b></div>
            <Doughnut data={categoryPie} options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom' },
                tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${inr(ctx.parsed)}` } }
              }
            }} />
          </div>
        </div>
      </div>
    </div>
  )
}

const cardStyle = {
  background:'#fff',
  border:'1px solid #eee',
  borderRadius:12,
  padding:16,
  boxShadow:'0 1px 2px rgba(0,0,0,0.04)'
}
const cardTitle = { margin:0, fontSize:13, color:'#666' }
const cardValue = { marginTop:6, fontSize:22, fontWeight:700 }

const chartCardStyle = {
  background:'#fff',
  border:'1px solid #eee',
  borderRadius:12,
  padding:16,
  boxShadow:'0 1px 2px rgba(0,0,0,0.04)'
}
const chartHeader = { marginBottom:8 }
const chartRow = {
  display:'grid',
  gridTemplateColumns:'1fr 1fr',
  gap:16
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Simple top nav */}
      <nav style={{display:'flex', gap:12, padding:12, borderBottom:'1px solid #eee', position:'sticky', top:0, background:'#fafafa', zIndex:1}}>
        <NavLink to="/" style={linkStyle} end>Dashboard</NavLink>
        <NavLink to="/products" style={linkStyle}>Products</NavLink>
        <div style={{marginLeft:'auto', display:'flex', gap:12}}>
          <NavLink to="/register" style={linkStyle}>Register</NavLink>
          <NavLink to="/login" style={linkStyle}>Login</NavLink>
        </div>
      </nav>

      <div style={{padding:12}}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

const linkStyle = ({ isActive }) => ({
  padding:'6px 10px',
  borderRadius:8,
  textDecoration:'none',
  color: isActive ? '#111' : '#444',
  background: isActive ? '#e9f0ff' : 'transparent',
  fontWeight: 600
})
