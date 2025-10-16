// src/routes/products.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/requireAuth.js';

const prisma = new PrismaClient();
const router = express.Router();

// GET /products (protected)
router.get('/', requireAuth, async (_req, res) => {
  try {
    const products = await prisma.products.findMany({
      orderBy: { id: 'desc' },
      take: 200,
    });
    res.json(products);
  } catch (e) {
    console.error('products error', e);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
