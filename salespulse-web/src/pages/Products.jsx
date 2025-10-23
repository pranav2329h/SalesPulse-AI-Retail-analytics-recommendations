import React, { useEffect, useState } from 'react'
import { fetchJSON } from '../lib/fetchJSON'
import './style.css'

export default function Products() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('')
  const [form, setForm] = useState({ name:'', sku:'', price:'', stock_qty:'', category:'' })
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')

  const load = async () => {
    setErr(''); setOk('')
    try {
      const params = new URLSearchParams({ search, category, sort })
      const data = await fetchJSON(`/products?${params}`)
      setProducts(Array.isArray(data) ? data : [])
    } catch (e) { setErr(e.message); setProducts([]) }
  }

  useEffect(() => { load() }, [search, category, sort])

  const addProduct = async (e) => {
    e.preventDefault()
    setErr(''); setOk('')
    try {
      const data = await fetchJSON('/products', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form)
      })
      setOk('Product added!'); setForm({ name:'', sku:'', price:'', stock_qty:'', category:'' }); load()
    } catch (e) { setErr(e.message) }
  }

  return (
    <div className="products-page">
      <h1>Products</h1>
      {err && <div className="alert error glass">{err}</div>}
      {ok && <div className="alert success glass">{ok}</div>}
      <div className="filters">
        <input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}/>
        <select value={category} onChange={e=>setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option>Jewellery</option><option>Electronics</option><option>Fashion</option>
          <option>Accessories</option><option>Footwear</option><option>Home Appliances</option>
        </select>
        <select value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="">Newest</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
        </select>
      </div>
      <form className="add-form" onSubmit={addProduct}>
        <h3>Add Product</h3>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
        <input placeholder="SKU" value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})} required/>
        <input placeholder="Price" type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required/>
        <input placeholder="Stock" type="number" value={form.stock_qty} onChange={e=>setForm({...form,stock_qty:e.target.value})}/>
        <input placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} required/>
        <button>Add</button>
      </form>
      <div className="product-grid">
        {products.map(p=>(
          <div className="product-card" key={p.id}>
            <h4>{p.name}</h4>
            <p><b>SKU:</b> {p.sku}</p>
            <p><b>Category:</b> {p.category}</p>
            <p><b>Price:</b> ₹{p.price}</p>
            <p><b>Stock:</b> {p.stock_qty}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
