// src/routes/productRoutes.js
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = Router()

// GET /products?search=&category=&sort=price_asc
router.get('/', async (req, res) => {
  try {
    const { search, category, sort } = req.query
    const where = {}

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
        { category: { contains: search } },
      ]
    }
    if (category) where.category = category

    let orderBy = { createdAt: 'desc' }
    if (sort === 'price_asc') orderBy = { price: 'asc' }
    if (sort === 'price_desc') orderBy = { price: 'desc' }

    const products = await prisma.product.findMany({ where, orderBy })
    res.json(products)
  } catch (err) {
    console.error('product list error', err)
    res.status(500).json({ error: 'internal_error' })
  }
})

// POST /products  -> add new product
router.post('/', async (req, res) => {
  try {
    const { name, sku, price, stock_qty, category } = req.body
    if (!name || !sku || !price) return res.status(400).json({ error: 'Missing fields' })

    const product = await prisma.product.create({
      data: { name, sku, price: Number(price), stock_qty: Number(stock_qty || 0), category },
    })
    res.status(201).json(product)
  } catch (err) {
    console.error('product add error', err)
    res.status(500).json({ error: 'internal_error' })
  }
})

export default router
