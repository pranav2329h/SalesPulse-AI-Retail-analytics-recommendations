import { Router } from 'express'
import { prisma } from '../prisma.js'

const router = Router()

// GET /products?take=20&skip=0&search=iphone
router.get('/', async (req, res) => {
  const take = Math.min(Number(req.query.take ?? 20), 100)
  const skip = Math.max(Number(req.query.skip ?? 0), 0)
  const search = String(req.query.search ?? '').trim()

  const where = search
    ? { OR: [
        { name:     { contains: search } },
        { sku:      { contains: search } },
        { category: { contains: search } },
      ]}
    : {}

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      take, skip,
      select: { id:true, name:true, sku:true, category:true, price:true, stockQty:true }
    }),
    prisma.product.count({ where }),
  ])

  res.json({ items, total, take, skip })
})

// GET /products/:id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) return res.status(404).json({ error: 'Not found' })
  res.json(product)
})

// POST /products
router.post('/', async (req, res) => {
  const { sku, name, category, price, stockQty } = req.body
  if (!sku || !name) return res.status(400).json({ error: 'sku and name are required' })
  try {
    const created = await prisma.product.create({
      data: {
        sku, name,
        category: category ?? null,
        price: Number(price ?? 0),
        stockQty: Number(stockQty ?? 0),
      }
    })
    res.status(201).json(created)
  } catch (e) {
    res.status(400).json({ error: String(e.message || e) })
  }
})

export default router
