// src/server.js
import app from './app.js'
import { prisma } from './lib/prisma.js'

const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => {
  console.log(`✅ API running on http://localhost:${PORT}`)
})

const shutdown = async () => {
  try { await prisma.$disconnect() } finally {
    server.close(() => process.exit(0))
  }
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
