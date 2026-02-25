const mongoose = require("mongoose");

const connectDB = async () => {
  try {

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not defined in environment variables");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

  } catch (err) {

    console.error("❌ MongoDB Connection Error:", err.message);

    // DO NOT crash instantly in production
    setTimeout(() => process.exit(1), 5000);
  }
};

module.exports = connectDB;