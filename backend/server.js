const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employees");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("EMS API is running"));

app.use("/api", authRoutes);
app.use("/api/employees", employeeRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Generic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
