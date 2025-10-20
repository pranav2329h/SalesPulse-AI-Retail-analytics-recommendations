// src/lib/prisma.js
import { PrismaClient } from '@prisma/client'

// prevent creating multiple clients in dev with nodemon
const globalForPrisma = globalThis

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // turn on more logs if you want: ['query','info','warn','error']
    log: ['warn', 'error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
