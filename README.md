# 🧠 SalesPulse – AI-Powered Retail Analytics & Product Dashboard

**SalesPulse** is a full-stack retail analytics platform built with **React + Express + MySQL + Prisma + Chart.js**.  
It provides real-time insights into sales performance, product categories, and top-selling SKUs through beautiful interactive charts and an animated glass-morphism dashboard UI.

---

## 🚀 Features

### 🔹 Admin Dashboard
- Dynamic **Revenue-by-Day**, **Category Sales**, and **Top SKU** charts.
- Smooth animations, hover effects, and glass UI.
- Auto-updating KPIs (total revenue, best category, best SKU).

### 🔹 Product Management
- Full CRUD operations for products (Add, Update, Delete, Filter).
- Category-based sorting and search bar.
- Live inventory stats with animated table and dropdown filters.

### 🔹 Authentication (optional / demo)
- Single admin user (demo login via frontend logic).
- Secure JWT login flow (Express backend ready if re-enabled).

### 🔹 Backend API
- Built using **Node.js (Express)** and **Prisma ORM**.
- MySQL database for structured analytics.
- Routes for `/auth`, `/kpis`, and `/products`.

### 🔹 Visuals & UX
- Elegant **dark glass-morphism** theme.
- Responsive dashboard layout.
- Animated charts (fade, pop, sequential reveal).
- Smooth hover interactions and shadows.

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React, React Router, Chart.js, React-Chartjs-2 |
| **Backend** | Node.js, Express, Prisma ORM |
| **Database** | MySQL |
| **Styling** | CSS3, Tailwind-inspired custom utilities, Glassmorphism |
| **Auth** | JSON Web Token (JWT), bcryptjs |
| **Environment** | dotenv, nodemon for development |

---

## ⚙️ Project Setup

# Backend
cd salespulse-web/salespulse-api
npm install

# Frontend
cd ../salespulse-client
npm install

DATABASE_URL="mysql://root:password@localhost:3306/salespulse"
JWT_SECRET="supersecret"
PORT=4000

npx prisma generate
npx prisma db push

npm run seed:demo

# Backend
cd salespulse-api
npm run dev

# Frontend
cd ../salespulse-client
npm run dev

salespulse-web/
├── salespulse-api/          # Express + Prisma backend
│   ├── prisma/              # Prisma schema & migrations
│   ├── src/
│   │   ├── routes/          # API route files (auth, products, kpis)
│   │   ├── middleware/      # Auth middlewares
│   │   ├── scripts/         # Data seeding scripts
│   │   └── server.js        # Main Express app
│   ├── .env
│   ├── package.json
│   └── README.md
│
├── salespulse-client/       # React Frontend
│   ├── src/
│   │   ├── pages/           # Login, Dashboard, Products
│   │   ├── components/      # Sidebar, Navbar
│   │   ├── lib/             # Fetch utilities, chart setup
│   │   ├── assets/          # Logos, icons
│   │   ├── chartSetup.js    # Chart.js config (if using)
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── README.md


model User {
  id           Int      @id @default(autoincrement())
  name         String?
  email        String   @unique
  passwordHash String   @map("password_hash")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Product {
  id         Int      @id @default(autoincrement())
  name       String
  sku        String   @unique
  category   String?
  price      Decimal  @db.Decimal(10, 2)
  stock_qty  Int      @default(0)
  created_at DateTime @default(now())
}

model Sale {
  id         Int      @id @default(autoincrement())
  orderDate  DateTime @map("order_date")
  sku        String
  category   String
  quantity   Int
  unitPrice  Decimal  @map("unit_price") @db.Decimal(10,2)
  revenue    Decimal  @db.Decimal(12,2)
  createdAt  DateTime @default(now()) @map("created_at")
  @@map("sales")
}


Username: admin
Password: admin123



### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/SalesPulse-AI-Retail-analytics-recommendations.git
cd SalesPulse-AI-Retail-analytics-recommendations



---

### 🧠 Notes
- Replace your GitHub repo link and contact info in the placeholders.
- Add screenshots under `/docs/` for a polished look.
- If your repo uses `salespulse-web/salespulse-api` and `salespulse-client`, keep folder structure in the README.

---

Would you like me to create a **shorter “demo-optimized” README** (for GitHub front page, lighter with screenshots and badges)?
