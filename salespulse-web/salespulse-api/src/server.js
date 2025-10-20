// src/server.js
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import kpiRouter from './routes/kpiRoutes.js'

const app = express()

// If you plan to use cookies/sessions, keep this (safe even if not using proxies)
app.set('trust proxy', 1)

const allowedOrigins = [
  'http://localhost:5173',   // Vite dev
  // add other dev/staging origins here if needed
]

// CORS middleware configured for credentials
const corsOptions = {
  origin: function (origin, callback) {
    // Allow mobile apps / curl (no origin) and our dev origins
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`))
  },
  credentials: true, // <-- important when client sends withCredentials:true
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))

// Preflight for all routes
app.options('*', cors(corsOptions))

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
