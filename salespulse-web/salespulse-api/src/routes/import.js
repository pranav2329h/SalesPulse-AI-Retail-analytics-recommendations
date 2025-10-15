// src/routes/import.js
import { Router } from 'express'
import multer from 'multer'
import { parse } from 'csv-parse'
import { prisma } from '../prisma.js'

const upload = multer({ storage: multer.memoryStorage() })
const router = Router()

router.post('/sales', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

    // Parse CSV to rows
    const rows = await new Promise((resolve, reject) => {
      const out = []
      const parser = parse(req.file.buffer, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      })
      parser.on('readable', () => {
        let r
        while ((r = parser.read())) out.push(r)
      })
      parser.on('end', () => resolve(out))
      parser.on('error', reject)
    })

    // Caches to minimize DB hits
    const productIdBySku = new Map()
    const customerIdByEmail = new Map()

    async function getOrCreateProduct({ sku, name, category, unit_price }) {
      if (productIdBySku.has(sku)) return productIdBySku.get(sku)
      let p = await prisma.product.findUnique({ where: { sku } })
      if (!p) {
        p = await prisma.product.create({
          data: {
            sku,
            name: name || sku,
            category: category || null,
            price: Number(unit_price || 0),
            stockQty: 0,
          },
        })
      }
      productIdBySku.set(sku, p.id)
      return p.id
    }

    async function getOrCreateCustomer({ name, email }) {
      if (!email) return null
      const key = email.toLowerCase()
      if (customerIdByEmail.has(key)) return customerIdByEmail.get(key)
      let c = await prisma.customer.findUnique({ where: { email: key } })
      if (!c) {
        c = await prisma.customer.create({
          data: { name: name || 'Customer', email: key },
        })
      }
      customerIdByEmail.set(key, c.id)
      return c.id
    }

    // Group rows by external order id
    const groups = rows.reduce((acc, r) => {
      const id = r.order_external_id || r.order_id || `ROW-${acc._i ?? 0}`
      acc[id] = acc[id] || []
      acc[id].push(r)
      acc._i = (acc._i || 0) + 1
      return acc
    }, {})

    let createdOrders = 0
    let createdItems = 0

    for (const extId of Object.keys(groups).filter(k => k !== '_i')) {
      const lines = groups[extId]
      const first = lines[0]

      const customerId = await getOrCreateCustomer({
        name: first.customer_name,
        email: first.customer_email,
      })

      const createdAt = first.order_date ? new Date(first.order_date) : new Date()
      const order = await prisma.order.create({
        data: {
          customerId: customerId ?? null,
          createdAt,
          total: 0,
        },
      })
      createdOrders++

      let total = 0
      for (const r of lines) {
        const productId = await getOrCreateProduct({
          sku: r.sku,
          name: r.product_name,
          category: r.category,
          unit_price: r.unit_price,
        })
        const qty = Number(r.qty || 1)
        const price = Number(r.unit_price || 0)
        total += qty * price
        await prisma.orderItem.create({
          data: { orderId: order.id, productId, qty, price },
        })
        createdItems++
      }

      await prisma.order.update({ where: { id: order.id }, data: { total } })
    }

    res.json({ ok: true, createdOrders, createdItems })
  } catch (err) {
    console.error('Import error:', err)
    res.status(500).json({ error: 'Import failed', details: String(err?.message || err) })
  }
})

export default router
