// src/scripts/seedDemoData.js
import { PrismaClient } from '@prisma/client'
import faker from '@faker-js/faker'   // ✅ correct default import for Node 22
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding demo data...')

  // --- clean existing data ---
  await prisma.sale.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  // --- demo user ---
  const passwordHash = await bcrypt.hash('demo123', 10)
  await prisma.user.create({
    data: {
      email: 'demo@example.com',
      passwordHash,
    },
  })

  // --- products ---
  const products = []
  for (let i = 0; i < 20; i++) {
    const p = await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        sku: faker.string.alphanumeric(8).toUpperCase(),
        price: faker.number.float({ min: 100, max: 2000, precision: 0.01 }),
        stock_qty: faker.number.int({ min: 10, max: 500 }),
        category: faker.commerce.department(),
      },
      select: { id: true, sku: true, price: true, category: true },
    })
    products.push(p)
  }

  // --- sales (last 60 days) ---
  const today = new Date()
  const sales = []
  for (let i = 0; i < 220; i++) {
    const p = faker.helpers.arrayElement(products)
    const quantity = faker.number.int({ min: 1, max: 10 })
    const daysAgo = faker.number.int({ min: 0, max: 59 })
    const orderDate = new Date(today)
    orderDate.setDate(today.getDate() - daysAgo)

    const unitPrice = Number(p.price)
    const revenue = unitPrice * quantity

    sales.push({
      orderDate,
      sku: p.sku,
      category: p.category,
      quantity,
      unitPrice,
      revenue,
      createdAt: new Date(),
    })
  }

  await prisma.sale.createMany({ data: sales })
  console.log('✅ Demo data seeded: 1 user, 20 products, 220 sales')
  console.log('   Login with: demo@example.com / demo123')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
