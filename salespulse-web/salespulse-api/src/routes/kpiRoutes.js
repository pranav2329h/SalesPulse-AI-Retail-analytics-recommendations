import { Router } from 'express'
import { prisma } from '../prisma.js'

const router = Router()

// existing /revenue-by-day stays as is …

/**
 * GET /kpis/top-skus?days=60&limit=10
 * Returns: [{ sku, name, units, revenue }]
 */
router.get('/top-skus', async (req, res) => {
  const days = Number(req.query.days ?? 60)
  const limit = Math.min(Number(req.query.limit ?? 10), 50)

  try {
    const rows = await prisma.$queryRaw`
      SELECT p.sku, p.name,
             SUM(oi.qty) AS units,
             SUM(oi.qty * oi.price) AS revenue
      FROM order_items oi
      JOIN orders o   ON o.id = oi.order_id
      JOIN products p ON p.id = oi.product_id
      WHERE o.created_at >= DATE_SUB(CURDATE(), INTERVAL ${days} DAY)
      GROUP BY p.id
      ORDER BY units DESC
      LIMIT ${limit};
    `
    const data = rows.map(r => ({
      sku: String(r.sku),
      name: String(r.name),
      units: Number(r.units),
      revenue: Number(r.revenue),
    }))
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/**
 * GET /kpis/category-sales?days=60
 * Returns: [{ category, units, revenue }]
 */
router.get('/category-sales', async (req, res) => {
  const days = Number(req.query.days ?? 60)

  try {
    const rows = await prisma.$queryRaw`
      SELECT COALESCE(p.category, 'Uncategorized') AS category,
             SUM(oi.qty) AS units,
             SUM(oi.qty * oi.price) AS revenue
      FROM order_items oi
      JOIN orders o   ON o.id = oi.order_id
      JOIN products p ON p.id = oi.product_id
      WHERE o.created_at >= DATE_SUB(CURDATE(), INTERVAL ${days} DAY)
      GROUP BY COALESCE(p.category, 'Uncategorized')
      ORDER BY revenue DESC;
    `
    const data = rows.map(r => ({
      category: String(r.category),
      units: Number(r.units),
      revenue: Number(r.revenue),
    }))
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

export default router
