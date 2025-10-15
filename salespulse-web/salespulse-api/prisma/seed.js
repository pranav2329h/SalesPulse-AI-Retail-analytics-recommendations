// prisma/seed.js
import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const CATEGORIES = [
  'Electronics', 'Home & Kitchen', 'Clothing', 'Beauty',
  'Sports', 'Toys', 'Books', 'Groceries'
]

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

async function main() {
  console.log('🌱 Seeding...')

  // 1) Products
  const products = []
  for (let i = 0; i < 120; i++) {
    const category = faker.helpers.arrayElement(CATEGORIES)
    const price = Number(faker.commerce.price({ min: 99, max: 9999, dec: 0 }))
    const sku = `SKU-${faker.string.alphanumeric({ length: 8 }).toUpperCase()}`
    products.push({
      sku,
      name: faker.commerce.productName(),
      category,
      price,
      stock_qty: randInt(10, 500),
    })
  }

  // Insert products
  for (const p of products) {
    await prisma.$executeRawUnsafe(
      `INSERT INTO products (sku,name,category,price,stock_qty,created_at,updated_at)
       VALUES (?,?,?,?,?,NOW(),NOW())`,
      p.sku, p.name, p.category, p.price, p.stock_qty
    )
  }
  console.log(`✔ Inserted ${products.length} products`)

  // 2) Customers
  const customers = []
  for (let i = 0; i < 60; i++) {
    customers.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
    })
  }
  for (const c of customers) {
    await prisma.$executeRawUnsafe(
      `INSERT INTO customers (name,email,phone,created_at)
       VALUES (?,?,?,NOW())`,
      c.name, c.email, c.phone
    )
  }
  console.log(`✔ Inserted ${customers.length} customers`)

  // 3) Orders + OrderItems (last 90 days)
  const [productRows] = await prisma.$queryRawUnsafe(`SELECT id, price FROM products`)
  const [customerRows] = await prisma.$queryRawUnsafe(`SELECT id FROM customers`)

  const dayCount = 90
  let orderCount = 0
  let itemCount = 0

  for (let d = dayCount; d >= 0; d--) {
    const dayOrders = randInt(2, 10) // orders per day
    for (let i = 0; i < dayOrders; i++) {
      const customer = faker.helpers.arrayElement(customerRows)
      const createdAt = faker.date.recent({ days: d })
      // create order first with 0 total; we’ll update after items
      const result = await prisma.$executeRawUnsafe(
        `INSERT INTO orders (customer_id, created_at, total) VALUES (?,?,0)`,
        customer.id, createdAt
      )
      // get last insert id
      const [{ id: orderId }] = await prisma.$queryRawUnsafe(`SELECT LAST_INSERT_ID() AS id`)

      const lineCount = randInt(1, 4)
      let total = 0
      for (let l = 0; l < lineCount; l++) {
        const product = faker.helpers.arrayElement(productRows)
        const qty = randInt(1, 5)
        const price = product.price // use current product price for simplicity
        total += qty * price
        await prisma.$executeRawUnsafe(
          `INSERT INTO order_items (order_id, product_id, qty, price)
           VALUES (?,?,?,?)`,
          orderId, product.id, qty, price
        )
        itemCount++
      }
      await prisma.$executeRawUnsafe(
        `UPDATE orders SET total=? WHERE id=?`, total, orderId
      )
      orderCount++
    }
  }

  console.log(`✔ Inserted ${orderCount} orders and ${itemCount} order_items`)
  console.log('🌳 Seed complete.')
}

main().catch(e => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})
