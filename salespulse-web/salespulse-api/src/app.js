// src/app.js
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/authRoutes.js'
// import productRoutes from './routes/productRoutes.js' // if you have it

const app = express()

// middleware
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())        // <— important for POST bodies
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('dev'))

// mount routes
app.use('/auth', authRoutes)
// app.use('/products', productRoutes)

// health
app.get('/health', (_req, res) => res.json({ ok: true }))

// 404 fallback
app.use((req, res) => res.status(404).json({ error: 'not_found', path: req.path }))

export default app
