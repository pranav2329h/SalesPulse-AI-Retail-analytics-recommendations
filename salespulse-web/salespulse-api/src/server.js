// salespulse-api/src/server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { prisma } from "./prisma.js";

// ---- Routes (make sure these files exist with default exports) ----
import kpiRoutes from "./routes/kpiRoutes.js";     // KPIs: /kpis/*
import authRouter from "./routes/auth.js";         // Auth: /auth/*
import productsRouter from "./routes/products.js"; // Products: /products/*
import importRouter from "./routes/import.js";     // CSV import: /import/sales

// ---- Config ----
const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN =
  process.env.FRONTEND_URL || process.env.VITE_APP_URL || "http://localhost:5173";

// ---- App ----
const app = express();

// CORS (allow frontend)
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true, // allow cookies if you use httpOnly auth
  })
);

// Common middleware
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ---- Health & root ----
app.get("/", (_req, res) => {
  res.send("✅ SalesPulse API is running");
});

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, db: "up" });
  } catch (e) {
    res.status(500).json({ ok: false, db: "down", error: String(e) });
  }
});

// ---- Mount routers ----
app.use("/kpis", kpiRoutes);
app.use("/auth", authRouter);
app.use("/products", productsRouter);
app.use("/import", importRouter);

// ---- 404 (API) ----
app.use((req, res, next) => {
  if (req.path === "/" || req.method === "GET") return next(); // let SPA handle /
  res.status(404).json({ error: "Not Found", path: req.path });
});

// ---- Error handler ----
app.use((err, _req, res, _next) => {
  console.error("API error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// ---- Start server ----
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`   CORS allowed: ${FRONTEND_ORIGIN}`);
});

// ---- Graceful shutdown ----
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Closing server…`);
  try {
    await prisma.$disconnect();
  } finally {
    process.exit(0);
  }
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
