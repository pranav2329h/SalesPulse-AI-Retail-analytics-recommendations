import { Router } from 'express';
import { prisma } from '../prisma.js';

const router = Router();

/**
 * GET /customers?skip=0&take=20&search=sara
 */
router.get('/', async (req, res) => {
  const skip = Number(req.query.skip ?? 0);
  const take = Math.min(Number(req.query.take ?? 20), 100);
  const search = (req.query.search ?? '').toString().trim();

  try {
    const where = search
      ? { OR: [
          { name:  { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } }
        ] }
      : {};

    const [items, total] = await Promise.all([
      prisma.customers.findMany({ where, skip, take, orderBy: { created_at: 'desc' } }),
      prisma.customers.count({ where })
    ]);
    res.json({ items, total, skip, take });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;
