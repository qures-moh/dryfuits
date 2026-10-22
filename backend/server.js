require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
const testimonialRoutes = require("./routes/testimonials");
const faqRoutes = require("./routes/faqs");
const settingsRoutes = require("./routes/settings");
const uploadRoutes = require("./routes/upload");
const dashboardRoutes = require("./routes/dashboard");
const customStudioRoutes = require("./routes/customStudio");
const badgeRouter = require("./routes/badgeRoutes");

const app = express();
console.log("🔥 THIS IS MY DRY FRUIT SERVER");

app.get("/api/test", (req, res) => {
  console.log("TEST ROUTE HIT");

  res.json({
    success: true,
    message: "Correct server.js is running",
  });
});

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is missing");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing");
}

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  "/images",
  express.static(path.join(__dirname, "..", "public", "images"))
);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/custom-studio", customStudioRoutes);
app.use("/api/badges", badgeRouter);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/badges-test", (req, res) => {
  res.json({
    success: true,
    message: "Badge route is reaching server",
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  if (err.name === "MulterError") {
    return res.status(400).json({
      message: err.message,
    });
  }

  res.status(500).json({
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

const migrateBadges = require("./utils/migrateBadges");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    try {
      await migrateBadges();
    } catch (migErr) {
      console.warn("Badge migration notice:", migErr.message);
    }

    app.listen(PORT, () => {
      console.log(`Server running onfedv http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  });