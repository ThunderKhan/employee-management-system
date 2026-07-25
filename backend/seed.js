// Run once: node seed.js
// Creates an admin user from ADMIN_EMAIL / ADMIN_PASSWORD in .env
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");

const run = async () => {
  await connectDB();

  const email = (process.env.ADMIN_EMAIL || "admin@eleviq.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "Admin@123";

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin user already exists:", email);
    process.exit(0);
  }

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ email, password: hashed });

  console.log("Admin user created:");
  console.log("  email:", email);
  console.log("  password:", password);
  process.exit(0);
};

run();
