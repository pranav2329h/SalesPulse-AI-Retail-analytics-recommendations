import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { prisma } from "./prisma.js"
import authRouter from './routes/auth.js'
import kpiRouter from "./routes/kpiRoutes.js"

const app = express()
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ ok: true, db: "up", time: new Date().toISOString() })
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) })
  }
})

// 👇 this line mounts your KPI routes
app.use("/kpis", kpiRouter)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`))
app.use('/auth', authRouter)

import productsRouter from './routes/products.js'
app.use('/products', productsRouter)
