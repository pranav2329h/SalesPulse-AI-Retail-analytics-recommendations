// src/app.js
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import kpiRoutes from './routes/kpiRoutes.js'
import productRoutes from './routes/productRoutes.js'

const app = express()

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('dev'))

app.use('/auth', authRoutes)
app.use('/kpis', kpiRoutes)
app.use('/products', productRoutes)

app.get('/health', (_req, res) => res.json({ ok: true }))

// 404 -> JSON
app.use((req, res) => {
  res.status(404).json({ error: 'not_found', path: req.path })
})

// Global error handler -> JSON
app.use((err, req, res, _next) => {
  console.error('UNHANDLED_ERROR:', err)
  const code = err?.status || 500
  res.status(code).json({ error: 'internal_error', message: err?.message || '' })
})

export default app
