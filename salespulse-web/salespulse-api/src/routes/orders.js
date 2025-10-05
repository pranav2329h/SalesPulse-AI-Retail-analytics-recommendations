import { Router } from 'express';
import { prisma } from '../prisma.js';

const router = Router();

/**
 * GET /orders?skip=0&take=20&status=paid
 */
router.get('/', async (req, res) => {
  const skip = Number(req.query.skip ?? 0);
  const take = Math.min(Number(req.query.take ?? 20), 100);
  const status = (req.query.status ?? '').toString().trim();

  try {
    const where = status ? { status } : {};
    const [items, total] = await Promise.all([
      prisma.orders.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
        include: {
          customers: true
        }
      }),
      prisma.orders.count({ where })
    ]);
    res.json({ items, total, skip, take });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

/**
 * GET /orders/:id  (with items)
 */
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const order = await prisma.orders.findUnique({
      where: { id },
      include: {
        customers: true,
        order_items: {
          include: { products: true }
        }
      }
    });
    if (!order) return res.status(404).json({ error: 'Not found' });
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;
