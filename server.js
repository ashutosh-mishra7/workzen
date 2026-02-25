const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

/* ================= CORS FIX ================= */

const allowedOrigins = [
  "http://localhost:5173",
  "https://workzen-7.vercel.app",
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());

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
    message: "WorkZen API running",
  });
});

/* ================= ERROR ================= */

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: err.message || "Server Error",
  });
});

/* ================= START ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);