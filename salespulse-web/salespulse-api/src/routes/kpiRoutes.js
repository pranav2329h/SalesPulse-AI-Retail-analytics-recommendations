import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const router = Router()
const asInt = (v, d) => {
  const n = Number.parseInt(v, 10)
  return Number.isFinite(n) && n > 0 ? n : d
}

// revenue by day
router.get('/revenue-by-day', async (req, res) => {
  try {
    const days = asInt(req.query.days, 30)
    const rows = await prisma.$queryRaw`
      SELECT DATE(o.created_at) AS day,
             ROUND(SUM(oi.qty * COALESCE(oi.price, p.price, 0)), 2) AS revenue
      FROM order_items oi
      JOIN orders   o ON o.id = oi.order_id
      JOIN products p ON p.id = oi.product_id
      WHERE o.created_at >= DATE_SUB(CURDATE(), INTERVAL ${days} DAY)
      GROUP BY DATE(o.created_at)
      ORDER BY day ASC;
    `
    const data = rows.map(r => ({
      day: (r.day instanceof Date) ? r.day.toISOString().slice(0,10) : String(r.day),
      revenue: Number(r.revenue ?? 0)
    }))
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: 'Internal error' })
  }
})

// top skus
router.get('/top-skus', async (req, res) => {
  try {
    const days = asInt(req.query.days, 60)
    const limit = asInt(req.query.limit, 10)
    const rows = await prisma.$queryRaw`
      SELECT p.sku AS sku,
             ROUND(SUM(oi.qty * COALESCE(oi.price, p.price, 0)), 2) AS revenue,
             SUM(oi.qty) AS units
      FROM order_items oi
      JOIN orders   o ON o.id = oi.order_id
      JOIN products p ON p.id = oi.product_id
      WHERE o.created_at >= DATE_SUB(CURDATE(), INTERVAL ${days} DAY)
      GROUP BY p.sku
      ORDER BY revenue DESC
      LIMIT ${limit};
    `
    const data = rows.map(r => ({
      sku: String(r.sku),
      revenue: Number(r.revenue ?? 0),
      units: Number(r.units ?? 0)
    }))
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: 'Internal error' })
  }
})

// category sales
router.get('/category-sales', async (req, res) => {
  try {
    const days = asInt(req.query.days, 60)
    const rows = await prisma.$queryRaw`
      SELECT p.category AS category,
             ROUND(SUM(oi.qty * COALESCE(oi.price, p.price, 0)), 2) AS revenue
      FROM order_items oi
      JOIN orders   o ON o.id = oi.order_id
      JOIN products p ON p.id = oi.product_id
      WHERE o.created_at >= DATE_SUB(CURDATE(), INTERVAL ${days} DAY)
      GROUP BY p.category
      ORDER BY revenue DESC;
    `
    const data = rows.map(r => ({
      category: r.category === null ? 'Uncategorized' : String(r.category),
      revenue: Number(r.revenue ?? 0)
    }))
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: 'Internal error' })
  }
})

export default router
