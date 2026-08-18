const mongoose = require("mongoose");
const dns = require("dns");

// Ensure public DNS resolution for Atlas on Windows
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {}

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
  return conn;
};

module.exports = connectDB;
