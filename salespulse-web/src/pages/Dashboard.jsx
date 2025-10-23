import { useEffect, useMemo, useState } from 'react'
import { Line, Doughnut, Bar } from 'react-chartjs-2'
import { fetchJSON } from '../lib/fetchJSON'
import '../chartSetup'
import './style.css'

export default function Dashboard() {
  const [revByDay, setRevByDay] = useState([])
  const [catSales, setCatSales] = useState([])
  const [topSkus, setTopSkus] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const [r, c, t] = await Promise.all([
        fetchJSON('/kpis/revenue-by-day?days=60'),
        fetchJSON('/kpis/category-sales?days=60'),
        fetchJSON('/kpis/top-skus?days=60&limit=10')
      ])
      setRevByDay(Array.isArray(r) ? r : [])
      setCatSales(Array.isArray(c) ? c : [])
      setTopSkus(Array.isArray(t) ? t : [])
    } catch (e) { setErr(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const revenueLine = useMemo(() => ({
    labels: revByDay.map(d => d.day),
    datasets: [{
      label: 'Revenue',
      data: revByDay.map(d => d.revenue),
      borderColor: '#2a6efb',
      backgroundColor: 'rgba(42,110,251,0.25)',
      tension: 0.3,
      fill: true
    }]
  }), [revByDay])

  const catPie = useMemo(() => ({
    labels: catSales.map(c => c.category),
    datasets: [{
      data: catSales.map(c => c.revenue),
      backgroundColor: ['#2a6efb','#6a11cb','#ff6b6b','#00bfa6','#fbbf24','#10b981']
    }]
  }), [catSales])

  const topBar = useMemo(() => ({
    labels: topSkus.map(s => s.sku),
    datasets: [{
      label: 'Quantity',
      data: topSkus.map(s => s.quantity),
      backgroundColor: '#1e3a8a'
    }]
  }), [topSkus])

  const totalRev = revByDay.reduce((a,b)=>a+Number(b.revenue||0),0).toLocaleString('en-IN')

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {err && <div className="alert error glass">{err}</div>}
      {loading ? <div className="skeleton">Loading charts…</div> : (
        <>
          <div className="kpi-grid">
            <div className="kpi-card"><div className="kpi-label">Total Revenue</div><div className="kpi-value">₹{totalRev}</div></div>
            <div className="kpi-card"><div className="kpi-label">Top Category</div><div className="kpi-value">{catSales[0]?.category || '—'}</div></div>
            <div className="kpi-card"><div className="kpi-label">Top SKU</div><div className="kpi-value">{topSkus[0]?.sku || '—'}</div></div>
          </div>
          <div className="chart-grid">
            <div className="chart-card"><h3>Revenue by Day</h3><Line data={revenueLine}/></div>
            <div className="chart-card"><h3>Revenue by Category</h3><Doughnut data={catPie}/></div>
            <div className="chart-card full"><h3>Top SKUs</h3><Bar data={topBar}/></div>
          </div>
        </>
      )}
    </div>
  )
}
