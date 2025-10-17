import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const CATEGORIES = ['Electronics','Home & Kitchen','Sports','Beauty','Fashion','Groceries','Automotive']

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

async function main() {
  // If you already have products, we’ll use them; otherwise generate some SKUs inline
  const products = await prisma.products.findMany().catch(() => [])
  const useProducts = products.length > 0

  // wipe any old seed (optional)
  // await prisma.$executeRawUnsafe(`DELETE FROM sales`)

  const rows = []
  const today = new Date()

  for (let d = 0; d < 90; d++) {
    const day = new Date(today)
    day.setDate(day.getDate() - d)

    const ordersToday = rand(10, 30)
    for (let i = 0; i < ordersToday; i++) {
      const sold_at = new Date(day)
      sold_at.setHours(rand(9, 20), rand(0, 59), rand(0, 59), 0)

      let sku, name, category, price
      if (useProducts) {
        const p = products[rand(0, products.length - 1)]
        sku = p.sku
        category = p.category || CATEGORIES[rand(0, CATEGORIES.length - 1)]
        price = Number(p.price)
      } else {
        sku = `SKU-${rand(100, 999)}`
        category = CATEGORIES[rand(0, CATEGORIES.length - 1)]
        price = [199, 499, 999, 1499, 4999, 9999][rand(0, 5)]
      }
      const qty = rand(1, 5)

      rows.push({
        sold_at,
        sku,
        category,
        price,
        qty
      })
    }
  }

  // batch insert
  for (let i = 0; i < rows.length; i += 500) {
    await prisma.sales.createMany({ data: rows.slice(i, i + 500) })
  }

  console.log(`Seeded ${rows.length} sales rows.`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
