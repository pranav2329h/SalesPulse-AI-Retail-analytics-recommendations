// src/routes/kpiRoutes.js
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = Router()

// Helpers to sanitize numbers
const asInt = (v, def) => {
  const n = Number.parseInt(v, 10)
  return Number.isFinite(n) && n > 0 ? n : def
}

/**
 * GET /kpis/revenue-by-day?days=60
 * Returns: [{ day: 'YYYY-MM-DD', revenue: 123.45 }, ...]
 */
router.get('/revenue-by-day', async (req, res) => {
  try {
    const days = asInt(req.query.days, 30)

    const rows = await prisma.$queryRaw`
      SELECT DATE(order_date) AS day,
             ROUND(SUM(revenue), 2) AS revenue
      FROM \`sales\`
      WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL ${days} DAY)
      GROUP BY DATE(order_date)
      ORDER BY day ASC;
    `
    // Normalize types
    const data = rows.map(r => ({
      day: (r.day instanceof Date)
        ? r.day.toISOString().slice(0, 10)
        : String(r.day),
      revenue: Number(r.revenue ?? 0)
    }))

    res.json(data)
  } catch (err) {
    console.error('revenue-by-day error', err)
    res.status(500).json({ error: 'Internal error' })
  }
})

/**
 * GET /kpis/top-skus?days=60&limit=10
 * Returns: [{ sku, revenue, units }, ...]
 */
router.get('/top-skus', async (req, res) => {
  try {
    const days = asInt(req.query.days, 60)
    const limit = asInt(req.query.limit, 10)

    const rows = await prisma.$queryRaw`
      SELECT sku,
             ROUND(SUM(revenue), 2) AS revenue,
             SUM(quantity) AS units
      FROM \`sales\`
      WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL ${days} DAY)
      GROUP BY sku
      ORDER BY revenue DESC
      LIMIT ${limit};
    `
    const data = rows.map(r => ({
      sku: String(r.sku),
      revenue: Number(r.revenue ?? 0),
      units: Number(r.units ?? 0)
    }))

    res.json(data)
  } catch (err) {
    console.error('top-skus error', err)
    res.status(500).json({ error: 'Internal error' })
  }
})

/**
 * GET /kpis/category-sales?days=60
 * Returns: [{ category, revenue }, ...]
 */
router.get('/category-sales', async (req, res) => {
  try {
    const days = asInt(req.query.days, 60)

    const rows = await prisma.$queryRaw`
      SELECT category,
             ROUND(SUM(revenue), 2) AS revenue
      FROM \`sales\`
      WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL ${days} DAY)
      GROUP BY category
      ORDER BY revenue DESC;
    `
    const data = rows.map(r => ({
      category: String(r.category),
      revenue: Number(r.revenue ?? 0)
    }))

    res.json(data)
  } catch (err) {
    console.error('category-sales error', err)
    res.status(500).json({ error: 'Internal error' })
  }
})

export default router
