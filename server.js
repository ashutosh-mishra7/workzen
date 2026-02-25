const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

/* ================= CONNECT DATABASE ================= */

connectDB();

/* ================= INIT APP ================= */

const app = express();

/* ================= CORS CONFIG (FINAL PRODUCTION SAFE) ================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://workzen-7.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, mobile apps, server)
      if (!origin) return callback(null, true);

      // Allow exact origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow all Vercel preview deployments safely
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

/* ================= MIDDLEWARE ================= */

app.use(express.json());

/* ================= ROUTES ================= */

app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/tasks", require("./routes/tasks"));

/* ================= HEALTH CHECK ================= */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "WorkZen API running",
  });
});

/* ================= ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  console.error("ERROR:", err.stack);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 WorkZen API running on port ${PORT}`);
});