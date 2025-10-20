import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import kpiRouter from './routes/kpiRoutes.js'
import authRouter from './routes/authRoutes.js'
import productRouter from './routes/productRoutes.js'

const app = express()
app.set('trust proxy', 1)

// CORS that supports credentials from Vite (5173)
const allowedOrigins = ['http://localhost:5173']
const corsOptions = {
  origin(origin, cb) {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error(`Origin ${origin} not allowed by CORS`))
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

app.get('/health', (req, res) => res.json({ ok: true }))

// Routes
app.use('/kpis', kpiRouter)
app.use('/auth', authRouter)
app.use('/products', productRouter)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`))
