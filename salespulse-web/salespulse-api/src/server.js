import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { prisma } from './prisma.js';
import kpiRouter from './routes/kpiRoutes.js';
import productsRouter from './routes/products.js';
import customersRouter from './routes/customers.js';
import ordersRouter from './routes/orders.js';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Health + DB check
app.get('/health', async (req, res) => {
  try {
    // simple ping
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, db: 'up', time: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// Mount feature routers
app.use('/kpis', kpiRouter);
app.use('/products', productsRouter);
app.use('/customers', customersRouter);
app.use('/orders', ordersRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
