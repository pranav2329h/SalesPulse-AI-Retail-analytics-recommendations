import { Router } from 'express';
import { prisma } from '../prisma.js';

const router = Router();

/**
 * GET /products?skip=0&take=20&search=ring
 */
router.get('/', async (req, res) => {
  const skip = Number(req.query.skip ?? 0);
  const take = Math.min(Number(req.query.take ?? 20), 100);
  const search = (req.query.search ?? '').toString().trim();

  try {
    const where = search
      ? { OR: [
          { name: { contains: search } },
          { sku:  { contains: search } },
          { category: { contains: search } }
        ] }
      : {};

    const [items, total] = await Promise.all([
      prisma.products.findMany({ where, skip, take, orderBy: { created_at: 'desc' } }),
      prisma.products.count({ where })
    ]);

    res.json({ items, total, skip, take });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

/**
 * GET /products/low-stock?threshold=20
 */
router.get('/low-stock', async (req, res) => {
  const threshold = Number(req.query.threshold ?? 20);
  try {
    const items = await prisma.products.findMany({
      where: { stock_qty: { lt: threshold } },
      orderBy: { stock_qty: 'asc' },
      take: 100
    });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;
