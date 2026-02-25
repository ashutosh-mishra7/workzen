const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

/* ================= FINAL CORS FIX ================= */

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://workzen-7.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

/* ================= MIDDLEWARE ================= */

app.use(express.json());

/* ================= ROUTES ================= */

app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/tasks", require("./routes/tasks"));

/* ================= HEALTH ================= */

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "WorkZen API running"
  });
});

/* ================= START ================= */

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});