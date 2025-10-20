import { useEffect, useState } from 'react'
import { listProducts, createProduct, updateProduct, deleteProduct } from '../lib/api'

export default function Products() {
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [form, setForm] = useState({ name:'', sku:'', price:'', stock_qty:0, category:'' })
  const [editId, setEditId] = useState(null)
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  async function load() {
    const { data } = await listProducts(q)
    setItems(data)
  }
  useEffect(() => { load() }, []) // initial

  async function onSearch(e) {
    e.preventDefault()
    await load()
  }

  async function onCreate(e) {
    e.preventDefault()
    setMsg(null); setLoading(true)
    try {
      await createProduct({ ...form, price: Number(form.price), stock_qty: Number(form.stock_qty) })
      setForm({ name:'', sku:'', price:'', stock_qty:0, category:'' })
      await load()
      setMsg('Product created')
    } catch (e) {
      setMsg(e.response?.data?.error || 'Create failed')
    } finally {
      setLoading(false)
    }
  }

  async function onUpdate(e) {
    e.preventDefault()
    setMsg(null); setLoading(true)
    try {
      await updateProduct(editId, { ...form, price: Number(form.price), stock_qty: Number(form.stock_qty) })
      setEditId(null)
      setForm({ name:'', sku:'', price:'', stock_qty:0, category:'' })
      await load()
      setMsg('Product updated')
    } catch (e) {
      setMsg(e.response?.data?.error || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="row mb-2">
        <div className="h1">Products</div>
        <form className="row right" onSubmit={onSearch}>
          <input className="input" placeholder="Search name/sku/category…" value={q} onChange={e=>setQ(e.target.value)} />
          <button className="btn btn-ghost">Search</button>
        </form>
      </div>

      <div className="grid grid-2">
        {/* Form card */}
        <div className="card">
          <div className="h2 mb-1">{editId ? 'Edit product' : 'Create product'}</div>
          <form className="grid" onSubmit={editId ? onUpdate : onCreate}>
            <div>
              <div className="label">Name</div>
              <input className="input" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="USB-C Cable"/>
            </div>
            <div>
              <div className="label">SKU</div>
              <input className="input" value={form.sku} onChange={e=>setForm({...form, sku:e.target.value})} placeholder="SKU-USB-001"/>
            </div>
            <div className="grid grid-2">
              <div>
                <div className="label">Price</div>
                <input className="input" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} placeholder="299"/>
              </div>
              <div>
                <div className="label">Stock</div>
                <input className="input" value={form.stock_qty} onChange={e=>setForm({...form, stock_qty:e.target.value})} placeholder="50"/>
              </div>
            </div>
            <div>
              <div className="label">Category</div>
              <input className="input" value={form.category} onChange={e=>setForm({...form, category:e.target.value})} placeholder="Electronics"/>
            </div>

            <div className="row mt-2">
              <button className="btn btn-primary" disabled={loading}>
                {loading ? (editId ? 'Updating…' : 'Creating…') : (editId ? 'Update' : 'Create')}
              </button>
              {editId && (
                <button type="button" className="btn btn-ghost" onClick={() => { setEditId(null); setForm({ name:'', sku:'', price:'', stock_qty:0, category:'' }) }}>
                  Cancel
                </button>
              )}
              {msg && <span className="right help">{msg}</span>}
            </div>
          </form>
        </div>

        {/* Table card */}
        <div className="card">
          <div className="row mb-1">
            <b>Inventory</b>
            <span className="badge right">{items.length} items</span>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th style={{width:220}}>Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th style={{width:150}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id}>
                  <td><b>{p.name}</b></td>
                  <td className="sku">{p.sku}</td>
                  <td>{p.category || 'Uncategorized'}</td>
                  <td>₹{p.price}</td>
                  <td>{p.stock_qty}</td>
                  <td>
                    <div className="row">
                      <button className="btn btn-ghost" onClick={() => {
                        setEditId(p.id)
                        setForm({ name:p.name, sku:p.sku, price:String(p.price), stock_qty:Number(p.stock_qty), category:p.category || '' })
                      }}>Edit</button>
                      <button className="btn btn-danger" onClick={async ()=>{ await deleteProduct(p.id); await load() }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan="6" className="help">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
