import { Router } from "express"
import { prisma } from "../prisma.js"

const router = Router()

// GET /kpis/revenue-by-day
router.get("/revenue-by-day", async (req, res) => {
  const days = Number(req.query.days ?? 30)
  try {
    const rows = await prisma.$queryRaw`
      SELECT DATE(created_at) AS day, SUM(total) AS revenue
      FROM orders
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ${days} DAY)
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at);
    `
    res.json(
      rows.map(r => ({
        day: r.day instanceof Date ? r.day.toISOString().slice(0,10) : String(r.day),
        revenue: Number(r.revenue ?? 0)
      }))
    )
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

// GET /kpis/top-skus
router.get("/top-skus", async (req, res) => {
  const days = Number(req.query.days ?? 60)
  const limit = Math.min(Number(req.query.limit ?? 10), 50)
  try {
    const rows = await prisma.$queryRaw`
      SELECT p.sku, p.name,
             SUM(oi.qty) AS units,
             SUM(oi.qty * oi.price) AS revenue
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      JOIN products p ON p.id = oi.product_id
      WHERE o.created_at >= DATE_SUB(CURDATE(), INTERVAL ${days} DAY)
      GROUP BY p.id
      ORDER BY units DESC
      LIMIT ${limit};
    `
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

// GET /kpis/category-sales
router.get("/category-sales", async (req, res) => {
  const days = Number(req.query.days ?? 60)
  try {
    const rows = await prisma.$queryRaw`
      SELECT COALESCE(p.category, 'Uncategorized') AS category,
             SUM(oi.qty) AS units,
             SUM(oi.qty * oi.price) AS revenue
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      JOIN products p ON p.id = oi.product_id
      WHERE o.created_at >= DATE_SUB(CURDATE(), INTERVAL ${days} DAY)
      GROUP BY category
      ORDER BY revenue DESC;
    `
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

export default router
