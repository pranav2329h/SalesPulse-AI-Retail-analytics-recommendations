import { Router } from 'express';
import { prisma } from '../prisma.js';

const router = Router();

/**
 * GET /kpis/revenue-by-day?days=30
 * Returns: [{ day: '2025-09-10', revenue: 12345.67 }, ...]
 */
router.get('/revenue-by-day', async (req, res) => {
  const days = Number(req.query.days ?? 30);

  try {
    const rows = await prisma.$queryRaw`
      SELECT DATE(created_at) AS day, SUM(total) AS revenue
      FROM orders
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ${days} DAY)
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at);
    `;
    // Normalize MySQL RowDataPacket to plain objects
    const data = rows.map(r => ({
      day: r.day instanceof Date ? r.day.toISOString().slice(0, 10) : String(r.day),
      revenue: Number(r.revenue)
    }));
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;
