// src/server.js
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import kpiRouter from './routes/kpiRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/health', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'development' })
})

app.use('/kpis', kpiRouter)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
