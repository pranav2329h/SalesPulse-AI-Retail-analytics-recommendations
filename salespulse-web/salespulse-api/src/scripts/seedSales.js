import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding demo data...')

  // Create demo user
  const bcrypt = await import('bcryptjs')
  const hash = await bcrypt.hash('demo123', 10)
  await prisma.user.create({
    data: {
      email: 'demo@example.com',
      passwordHash: hash
    }
  })

  // Create 20 products
  const products = []
  for (let i = 0; i < 20; i++) {
    products.push(await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        sku: faker.string.alphanumeric(8).toUpperCase(),
        price: faker.number.float({ min: 100, max: 2000, precision: 0.01 }),
        stock_qty: faker.number.int({ min: 10, max: 500 }),
        category: faker.commerce.department()
      }
    }))
  }

  // Create 200 random sales (last 60 days)
  for (let i = 0; i < 200; i++) {
    const product = faker.helpers.arrayElement(products)
    const quantity = faker.number.int({ min: 1, max: 10 })
    const orderDate = faker.date.recent({ days: 60 })
    const revenue = Number(product.price) * quantity
    await prisma.sale.create({
      data: {
        orderDate,
        sku: product.sku,
        category: product.category,
        quantity,
        unitPrice: product.price,
        revenue
      }
    })
  }

  console.log('✅ Demo data seeded successfully!')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
