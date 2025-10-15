import { Router } from "express"
import { prisma } from "../prisma.js"

const router = Router()

// Revenue by day
router.get("/revenue-by-day", async (req, res) => {
  const days = Math.min(Number(req.query.days ?? 30), 365)

  const rows = await prisma.$queryRawUnsafe(`
    SELECT DATE(created_at) AS day, SUM(total) AS revenue
    FROM orders
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
    GROUP BY DATE(created_at)
    ORDER BY day ASC
  `, days)

  res.json(rows.map(r => ({ day: r.day, revenue: Number(r.revenue || 0) })))
})

// Top SKUs
router.get("/top-skus", async (req, res) => {
  const days = Math.min(Number(req.query.days ?? 60), 365)
  const limit = Math.min(Number(req.query.limit ?? 10), 50)

  const rows = await prisma.$queryRawUnsafe(`
    SELECT p.sku, p.name, SUM(oi.qty) AS units
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    JOIN products p ON p.id = oi.product_id
    WHERE o.created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
    GROUP BY p.sku, p.name
    ORDER BY units DESC
    LIMIT ?
  `, days, limit)

  res.json(rows.map(r => ({ sku: r.sku, name: r.name, units: Number(r.units || 0) })))
})

// Category sales
router.get("/category-sales", async (req, res) => {
  const days = Math.min(Number(req.query.days ?? 60), 365)

  const rows = await prisma.$queryRawUnsafe(`
    SELECT COALESCE(p.category, 'Uncategorized') AS category,
           SUM(oi.qty * oi.price) AS revenue
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    JOIN products p ON p.id = oi.product_id
    WHERE o.created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
    GROUP BY category
    ORDER BY revenue DESC
  `, days)

  res.json(rows.map(r => ({ category: r.category, revenue: Number(r.revenue || 0) })))
})

export default router
