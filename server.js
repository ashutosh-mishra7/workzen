const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

/* ================= CONNECT DATABASE ================= */

connectDB();

/* ================= INIT APP ================= */

const app = express();

/* ================= CORS CONFIG ================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://workzen-7.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, true);
    },
    credentials: true,
  })
);

/* IMPORTANT: DO NOT USE app.options("*") in Express 5 */

/* ================= MIDDLEWARE ================= */

app.use(express.json());

/* ================= ROUTES ================= */

app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/tasks", require("./routes/tasks"));

/* ================= HEALTH ================= */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "WorkZen API running",
  });
});

/* ================= ROOT ================= */

app.get("/", (req, res) => {
  res.json({
    message: "WorkZen API running",
  });
});

/* ================= ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

/* ================= START ================= */

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});