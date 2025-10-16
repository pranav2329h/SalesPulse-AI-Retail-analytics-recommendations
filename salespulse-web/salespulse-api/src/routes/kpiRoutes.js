// src/routes/kpis.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

/**
 * GET /kpis/revenue-by-day?days=30
 * Returns: [ { day: '2025-01-01', revenue: 1234.56 }, ... ]
 *
 * Adjust table/column names in SQL if your schema differs.
 */
router.get('/revenue-by-day', async (req, res) => {
  const days = Math.max(1, parseInt(req.query.days || '30', 10));

  try {
    const rows = await prisma.$queryRawUnsafe(
      `
      SELECT DATE(sold_at) AS day,
             SUM(price * qty) AS revenue
      FROM sales
      WHERE sold_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY DATE(sold_at)
      ORDER BY day ASC
      `,
      days
    );

    const data = (rows || []).map(r => ({
      day: r.day,
      revenue: Number(r.revenue || 0),
    }));

    res.json(data);
  } catch (e) {
    console.error('revenue-by-day error', e);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /kpis/top-skus?days=60&limit=10
 * Returns: [ { sku: 'SKU-XXX', units: 123 }, ... ]
 */
router.get('/top-skus', async (req, res) => {
  const days = Math.max(1, parseInt(req.query.days || '60', 10));
  const limit = Math.max(1, Math.min(50, parseInt(req.query.limit || '10', 10)));

  try {
    const rows = await prisma.$queryRawUnsafe(
      `
      SELECT sku, SUM(qty) AS units
      FROM sales
      WHERE sold_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY sku
      ORDER BY units DESC
      LIMIT ?
      `,
      days, limit
    );

    const data = (rows || []).map(r => ({
      sku: r.sku,
      units: Number(r.units || 0),
    }));

    res.json(data);
  } catch (e) {
    console.error('top-skus error', e);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /kpis/category-sales?days=60
 * Returns: [ { category: 'Electronics', revenue: 9999.99 }, ... ]
 */
router.get('/category-sales', async (req, res) => {
  const days = Math.max(1, parseInt(req.query.days || '60', 10));

  try {
    const rows = await prisma.$queryRawUnsafe(
      `
      SELECT COALESCE(category, 'Uncategorized') AS category,
             SUM(price * qty) AS revenue
      FROM sales
      WHERE sold_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY category
      ORDER BY revenue DESC
      `,
      days
    );

    const data = (rows || []).map(r => ({
      category: r.category,
      revenue: Number(r.revenue || 0),
    }));

    res.json(data);
  } catch (e) {
    console.error('category-sales error', e);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
