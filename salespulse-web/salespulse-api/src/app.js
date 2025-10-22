import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/authRoutes.js'
import kpiRoutes from './routes/kpiRoutes.js'

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('dev'))

app.use('/auth', authRoutes)
app.use('/kpis', kpiRoutes)

app.get('/health', (_req, res) => res.json({ ok: true }))
app.use((req, res) => res.status(404).json({ error: 'not_found', path: req.path }))

export default app
