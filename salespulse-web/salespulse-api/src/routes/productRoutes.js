// src/routes/productRoutes.js
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../middleware/requireAuth.js'

const prisma = new PrismaClient()
const router = Router()

// Small helpers
const toNumOrNull = (v) => (v === undefined || v === null || v === '' ? null : Number(v))
const isFiniteNum = (v) => typeof v === 'number' && Number.isFinite(v)

// LIST / SEARCH (public)
router.get('/', async (req, res) => {
  try {
    const q = (req.query.search || '').toString().trim()
    const like = q ? `%${q}%` : '%'
    const rows = await prisma.$queryRaw`
      SELECT id, name, sku, price, stock_qty, category, created_at
      FROM products
      WHERE name LIKE ${like} OR sku LIKE ${like} OR category LIKE ${like}
      ORDER BY created_at DESC
      LIMIT 200;
    `
    res.json(rows)
  } catch (e) {
    console.error('products list error', e)
    res.status(500).json({ error: 'internal_error' })
  }
})

// GET ONE (public)
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'invalid_id' })
    }

    const rows = await prisma.$queryRaw`
      SELECT id, name, sku, price, stock_qty, category, created_at
      FROM products
      WHERE id = ${id}
      LIMIT 1;
    `
    const p = rows[0]
    if (!p) return res.status(404).json({ error: 'not_found' })
    res.json(p)
  } catch (e) {
    console.error('products get error', e)
    res.status(500).json({ error: 'internal_error' })
  }
})

// CREATE (protected)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, sku, price, stock_qty, category } = req.body

    if (!name || !sku || price == null) {
      return res.status(400).json({ error: 'name, sku, price required' })
    }

    const priceNum = Number(price)
    const stockNum = toNumOrNull(stock_qty)
    if (!isFiniteNum(priceNum)) return res.status(400).json({ error: 'price must be a number' })
    if (stock_qty !== undefined && !isFiniteNum(stockNum)) {
      return res.status(400).json({ error: 'stock_qty must be a number' })
    }

    await prisma.$executeRaw`
      INSERT INTO products (name, sku, price, stock_qty, category, created_at)
      VALUES (${name}, ${sku}, ${priceNum}, ${stockNum ?? 0}, ${category ?? null}, NOW());
    `

    const rows = await prisma.$queryRaw`
      SELECT id, name, sku, price, stock_qty, category, created_at
      FROM products
      WHERE sku = ${sku}
      ORDER BY id DESC
      LIMIT 1;
    `
    res.status(201).json(rows[0])
  } catch (e) {
    // MySQL duplicate key
    if (e && (e.code === 'P2010' || e.code === 'P2002' || e.code === 'ER_DUP_ENTRY' || (e.meta && String(e.meta.message || '').includes('Duplicate')))) {
      return res.status(409).json({ error: 'sku_already_exists' })
    }
    if (e && (e.code === 'ER_DUP_ENTRY' || String(e.message || '').includes('Duplicate entry'))) {
      return res.status(409).json({ error: 'sku_already_exists' })
    }
    console.error('products create error', e)
    res.status(500).json({ error: 'internal_error' })
  }
})

// UPDATE (protected, partial)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'invalid_id' })
    }

    const { name, sku, price, stock_qty, category } = req.body
    const priceNum = price === undefined ? undefined : Number(price)
    const stockNum = stock_qty === undefined ? undefined : Number(stock_qty)

    if (price !== undefined && !isFiniteNum(priceNum)) {
      return res.status(400).json({ error: 'price must be a number' })
    }
    if (stock_qty !== undefined && !isFiniteNum(stockNum)) {
      return res.status(400).json({ error: 'stock_qty must be a number' })
    }

    // Partial update: keep existing values when a field is undefined
    await prisma.$executeRaw`
      UPDATE products
      SET
        name      = COALESCE(${name}, name),
        sku       = COALESCE(${sku}, sku),
        price     = COALESCE(${priceNum}, price),
        stock_qty = COALESCE(${stockNum}, stock_qty),
        category  = COALESCE(${category}, category)
      WHERE id = ${id};
    `

    const rows = await prisma.$queryRaw`
      SELECT id, name, sku, price, stock_qty, category, created_at
      FROM products
      WHERE id = ${id}
      LIMIT 1;
    `
    if (!rows[0]) return res.status(404).json({ error: 'not_found' })
    res.json(rows[0])
  } catch (e) {
    if (e && (e.code === 'ER_DUP_ENTRY' || String(e.message || '').includes('Duplicate entry'))) {
      return res.status(409).json({ error: 'sku_already_exists' })
    }
    console.error('products update error', e)
    res.status(500).json({ error: 'internal_error' })
  }
})

// DELETE (protected)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'invalid_id' })
    }
    await prisma.$executeRaw`DELETE FROM products WHERE id = ${id};`
    res.json({ ok: true })
  } catch (e) {
    console.error('products delete error', e)
    res.status(500).json({ error: 'internal_error' })
  }
})

export default router
