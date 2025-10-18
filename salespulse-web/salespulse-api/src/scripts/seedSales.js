// src/scripts/seedSales.js
import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

const CATEGORIES = ['Electronics', 'Apparel', 'Home', 'Beauty', 'Grocery']
const SKUS = Array.from({ length: 30 }, (_, i) => `SKU-${1000 + i}`)

function round2(n) {
  return Math.round(n * 100) / 100
}

async function main() {
  console.log('Seeding sales...')

  // Clear existing data if you want a clean slate (optional)
  // await prisma.sale.deleteMany()

  const today = new Date()
  const batch = []
  for (let d = 0; d < 90; d++) {
    const date = new Date(today)
    date.setHours(12, 0, 0, 0) // normalize time
    date.setDate(today.getDate() - d)

    // ~40 rows per day
    for (let i = 0; i < 40; i++) {
      const sku = faker.helpers.arrayElement(SKUS)
      const category = faker.helpers.arrayElement(CATEGORIES)
      const quantity = faker.number.int({ min: 1, max: 5 })
      const unitPrice = round2(faker.number.float({ min: 5, max: 500 }))
      const revenue = round2(quantity * unitPrice)

      batch.push({
        orderDate: date,
        sku,
        category,
        quantity,
        unitPrice,
        revenue
      })
    }
  }

  // Bulk insert
  await prisma.sale.createMany({
    data: batch,
    skipDuplicates: true
  })

  console.log(`Seeded ${batch.length} sales rows`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
