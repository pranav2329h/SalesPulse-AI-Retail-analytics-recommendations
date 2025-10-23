import React, { useEffect, useMemo, useState } from 'react'
import { fetchJSON } from '../lib/fetchJSON'
import './style.css'

export default function Products() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('')           // '', 'price_asc', 'price_desc'
  const [minPrice, setMinPrice] = useState('')   // numeric string
  const [maxPrice, setMaxPrice] = useState('')
  const [form, setForm] = useState({ name:'', sku:'', price:'', stock_qty:'', category:'' })
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')

  const load = async () => {
    setErr(''); setOk('')
    try {
      const params = new URLSearchParams({
        ...(search ? { search } : {}),
        ...(category ? { category } : {}),
        ...(sort ? { sort } : {}),
        ...(minPrice ? { minPrice } : {}),
        ...(maxPrice ? { maxPrice } : {})
      })
      const data = await fetchJSON(`/products?${params.toString()}`)
      setProducts(Array.isArray(data) ? data : [])
    } catch (e) {
      setErr(e.message || 'Failed to load products')
      setProducts([])
    }
  }

  useEffect(() => { load() }, [search, category, sort, minPrice, maxPrice])

  const addProduct = async (e) => {
    e.preventDefault()
    setErr(''); setOk('')
    try {
      const payload = {
        name: form.name.trim(),
        sku: form.sku.trim(),
        price: Number(form.price),
        stock_qty: Number(form.stock_qty || 0),
        category: form.category.trim()
      }
      if (!payload.name || !payload.sku || !payload.price) {
        setErr('Name, SKU and Price are required')
        return
      }
      const data = await fetchJSON('/products', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify(payload)
      })
      if (data && data.id) setOk('Product added!')
      else setOk('Saved')

      setForm({ name:'', sku:'', price:'', stock_qty:'', category:'' })
      load()
    } catch (e) {
      setErr(e.message || 'Failed to add product')
    }
  }

  // derive category list (unique) from loaded data
  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category).filter(Boolean))
    return Array.from(set).sort()
  }, [products])

  return (
    <div className="products-page">
      <h1>Products</h1>
      {err && <div className="alert error glass">{err}</div>}
      {ok && <div className="alert success glass">{ok}</div>}

      <div className="filters">
        <input
          placeholder="Search name / SKU / category"
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <select value={category} onChange={e=>setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.length === 0 && (
            <>
              <option>Jewellery</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Accessories</option>
              <option>Footwear</option>
              <option>Home Appliances</option>
            </>
          )}
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          placeholder="Min ₹"
          value={minPrice}
          onChange={e=>setMinPrice(e.target.value)}
          style={{width: '120px'}}
        />
        <input
          type="number"
          inputMode="decimal"
          min="0"
          placeholder="Max ₹"
          value={maxPrice}
          onChange={e=>setMaxPrice(e.target.value)}
          style={{width: '120px'}}
        />
        <select value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="">Newest</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
        </select>
      </div>

      <form className="add-form" onSubmit={addProduct}>
        <h3>Add Product</h3>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        <input placeholder="SKU" value={form.sku} onChange={e=>setForm({...form, sku:e.target.value})} required />
        <input placeholder="Price" type="number" min="0" step="0.01" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} required />
        <input placeholder="Stock" type="number" min="0" step="1" value={form.stock_qty} onChange={e=>setForm({...form, stock_qty:e.target.value})} />
        <input placeholder="Category" value={form.category} onChange={e=>setForm({...form, category:e.target.value})} required />
        <button type="submit">Add</button>
      </form>

      <div className="product-grid">
        {products.map(p=>(
          <div className="product-card" key={p.id}>
            <h4 title={p.name}>{p.name}</h4>
            <p><b>SKU:</b> {p.sku}</p>
            <p><b>Category:</b> {p.category}</p>
            <p><b>Price:</b> ₹{Number(p.price).toLocaleString('en-IN')}</p>
            <p><b>Stock:</b> {p.stock_qty}</p>
          </div>
        ))}
        {products.length === 0 && (
          <div className="skeleton">No products match your filters.</div>
        )}
      </div>
    </div>
  )
}
