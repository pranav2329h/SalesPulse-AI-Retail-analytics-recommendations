import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../middleware/requireAuth.js'

const prisma = new PrismaClient()
const router = Router()

// list/search
router.get('/', async (req, res) => {
  try {
    const q = req.query.search?.trim()
    const like = q ? `%${q}%` : '%'
    const rows = await prisma.$queryRaw`
      SELECT id,name,sku,price,stock_qty,category,created_at
      FROM products
      WHERE name LIKE ${like} OR sku LIKE ${like} OR category LIKE ${like}
      ORDER BY created_at DESC
      LIMIT 200;
    `
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: 'Internal error' })
  }
})

// get one
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const rows = await prisma.$queryRaw`
      SELECT id,name,sku,price,stock_qty,category,created_at
      FROM products
      WHERE id=${id} LIMIT 1;
    `
    const p = rows[0]
    if (!p) return res.status(404).json({ error: 'Not found' })
    res.json(p)
  } catch (e) {
    res.status(500).json({ error: 'Internal error' })
  }
})

// create (protected)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, sku, price, stock_qty, category } = req.body
    if (!name || !sku || price == null) return res.status(400).json({ error: 'name, sku, price required' })
    await prisma.$executeRaw`
      INSERT INTO products (name,sku,price,stock_qty,category,created_at)
      VALUES (${name},${sku},${price},${stock_qty ?? 0},${category ?? null},NOW());
    `
    const rows = await prisma.$queryRaw`
      SELECT id,name,sku,price,stock_qty,category,created_at
      FROM products
      WHERE sku=${sku} ORDER BY id DESC LIMIT 1;
    `
    res.status(201).json(rows[0])
  } catch (e) {
    if (String(e.message || '').includes('Duplicate')) {
      return res.status(409).json({ error: 'SKU already exists' })
    }
    res.status(500).json({ error: 'Internal error' })
  }
})

// update (protected)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { name, sku, price, stock_qty, category } = req.body
    await prisma.$executeRaw`
      UPDATE products
      SET name=${name}, sku=${sku}, price=${price}, stock_qty=${stock_qty}, category=${category}
      WHERE id=${id};
    `
    const rows = await prisma.$queryRaw`
      SELECT id,name,sku,price,stock_qty,category,created_at
      FROM products
      WHERE id=${id} LIMIT 1;
    `
    res.json(rows[0])
  } catch (e) {
    res.status(500).json({ error: 'Internal error' })
  }
})

// delete (protected)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id)
    await prisma.$executeRaw`DELETE FROM products WHERE id=${id};`
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'Internal error' })
  }
})

export default router
