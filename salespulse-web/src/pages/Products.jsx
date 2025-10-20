import { useEffect, useState } from 'react'
import { listProducts, createProduct, updateProduct, deleteProduct } from '../lib/api'

export default function Products() {
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [form, setForm] = useState({ name:'', sku:'', price:'', stock_qty:0, category:'' })
  const [editId, setEditId] = useState(null)
  const [msg, setMsg] = useState(null)

  async function load() {
    const { data } = await listProducts(q)
    setItems(data)
  }
  useEffect(() => { load() }, []) // initial load

  async function onSearch(e) {
    e.preventDefault()
    await load()
  }

  async function onCreate(e) {
    e.preventDefault()
    try {
      await createProduct({ ...form, price: Number(form.price), stock_qty: Number(form.stock_qty) })
      setForm({ name:'', sku:'', price:'', stock_qty:0, category:'' })
      await load()
      setMsg('Product created')
    } catch (e) {
      setMsg(e.response?.data?.error || 'Create failed')
    }
  }

  async function onUpdate(e) {
    e.preventDefault()
    try {
      await updateProduct(editId, { ...form, price: Number(form.price), stock_qty: Number(form.stock_qty) })
      setEditId(null)
      setForm({ name:'', sku:'', price:'', stock_qty:0, category:'' })
      await load()
      setMsg('Product updated')
    } catch (e) {
      setMsg(e.response?.data?.error || 'Update failed')
    }
  }

  return (
    <div>
      <h2>Products</h2>

      <form onSubmit={onSearch} style={{display:'flex', gap:8, marginBottom:12}}>
        <input placeholder="Search name/sku/category" value={q} onChange={e=>setQ(e.target.value)} />
        <button>Search</button>
      </form>

      <h3>{editId ? 'Edit' : 'Create'} Product</h3>
      <form onSubmit={editId ? onUpdate : onCreate} style={{display:'grid', gap:8, maxWidth:420}}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input placeholder="SKU" value={form.sku} onChange={e=>setForm({...form, sku:e.target.value})} />
        <input placeholder="Price" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} />
        <input placeholder="Stock Qty" value={form.stock_qty} onChange={e=>setForm({...form, stock_qty:e.target.value})} />
        <input placeholder="Category" value={form.category} onChange={e=>setForm({...form, category:e.target.value})} />
        <div style={{display:'flex', gap:8}}>
          <button type="submit">{editId ? 'Update' : 'Create'}</button>
          {editId && <button type="button" onClick={()=>{ setEditId(null); setForm({ name:'', sku:'', price:'', stock_qty:0, category:'' })}}>Cancel</button>}
        </div>
      </form>

      {msg && <p>{msg}</p>}

      <ul>
        {items.map(p => (
          <li key={p.id} style={{margin:'8px 0'}}>
            <b>{p.name}</b> ({p.sku}) — ₹{p.price} • stock {p.stock_qty} • {p.category || 'Uncategorized'}
            <div style={{display:'inline-flex', gap:8, marginLeft:12}}>
              <button onClick={() => { setEditId(p.id); setForm({ name:p.name, sku:p.sku, price:String(p.price), stock_qty:Number(p.stock_qty), category:p.category || '' })}}>
                Edit
              </button>
              <button onClick={async ()=>{ await deleteProduct(p.id); await load() }}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
