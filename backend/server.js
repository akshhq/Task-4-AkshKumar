// server.js

require("dotenv").config();

const express = require("express");
const cors    = require("cors");
const path    = require("path");
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

// API Routes
app.use("/students",    require("./routes/students"));
app.use("/assignments", require("./routes/assignments"));
app.use("/notices",     require("./routes/notices"));

// GET /health — Health check
app.get("/health", (req, res) => {
  res.json({ status: "Server Running" });
});

// 404 handler (API routes only)
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// 500 error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});