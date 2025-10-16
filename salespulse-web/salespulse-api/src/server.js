// src/server.js
import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import kpiRoutes from './routes/kpiRoutes.js'; // <-- ensure this file exists

const app = express();
const PORT = process.env.PORT || 4000;

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Allow Vite dev origin
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  })
);

app.get('/', (_req, res) => res.send('✅ SalesPulse API is running'));

// Mount routes
app.use('/auth', authRoutes);
app.use('/products', productsRoutes);
app.use('/kpis', kpiRoutes);

// 404
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
