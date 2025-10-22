import { Router } from 'express'
import { prisma } from '../lib/prisma.js'

const router = Router()

// GET /kpis/revenue-by-day?days=60
router.get('/revenue-by-day', async (req, res) => {
  try {
    const days = Number(req.query.days || 30)
    const since = new Date()
    since.setDate(since.getDate() - days)

    // Use raw SQL to group by DATE for MySQL
    const rows = await prisma.$queryRaw`
      SELECT DATE(order_date) AS day, SUM(revenue) AS revenue
      FROM sales
      WHERE order_date >= ${since}
      GROUP BY DATE(order_date)
      ORDER BY day ASC;
    `
    res.json(rows.map(r => ({ day: r.day, revenue: Number(r.revenue) })))
  } catch (err) {
    console.error('revenue-by-day error', err)
    res.status(500).json({ error: 'internal_error' })
  }
})

// GET /kpis/category-sales?days=60
router.get('/category-sales', async (req, res) => {
  try {
    const days = Number(req.query.days || 30)
    const since = new Date()
    since.setDate(since.getDate() - days)

    const rows = await prisma.$queryRaw`
      SELECT category, SUM(revenue) AS revenue
      FROM sales
      WHERE order_date >= ${since}
      GROUP BY category
      ORDER BY revenue DESC;
    `
    res.json(rows.map(r => ({ category: r.category, revenue: Number(r.revenue) })))
  } catch (err) {
    console.error('category-sales error', err)
    res.status(500).json({ error: 'internal_error' })
  }
})

// GET /kpis/top-skus?days=60&limit=10
router.get('/top-skus', async (req, res) => {
  try {
    const days = Number(req.query.days || 30)
    const limit = Number(req.query.limit || 10)
    const since = new Date()
    since.setDate(since.getDate() - days)

    const rows = await prisma.$queryRaw`
      SELECT sku, SUM(quantity) AS qty, SUM(revenue) AS revenue
      FROM sales
      WHERE order_date >= ${since}
      GROUP BY sku
      ORDER BY qty DESC
      LIMIT ${limit};
    `
    res.json(rows.map(r => ({
      sku: r.sku,
      quantity: Number(r.qty),
      revenue: Number(r.revenue),
    })))
  } catch (err) {
    console.error('top-skus error', err)
    res.status(500).json({ error: 'internal_error' })
  }
})

export default router
