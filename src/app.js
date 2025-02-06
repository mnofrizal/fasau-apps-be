require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { PrismaClient } = require("@prisma/client");
const socketUtils = require("./utils/socket");
const routes = require("./routes");

// Initialize express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const io = socketUtils.init(httpServer);

// Initialize Prisma
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/v1", routes);

// Base route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to FASAU API",
    version: "1.0.0",
    docsUrl: "/api/v1/docs", // For future API documentation
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const { errorResponse } = require("./utils/responseHandler");
  console.error(err.stack);
  return errorResponse(
    res,
    err.status || 500,
    err.message || "Something broke!"
  );
});

// 404 handler
app.use((req, res) => {
  const { notFoundResponse } = require("./utils/responseHandler");
  return notFoundResponse(res, "Route not found");
});

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/v1`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = { app, io, prisma };
