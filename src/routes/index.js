const express = require("express");
const userRoutes = require("./userRoutes");
const taskRoutes = require("./taskRoutes");
const acaraRoutes = require("./acaraRoutes");
const reportRoutes = require("./reportRoutes");
const whatsappConfigRoutes = require("./whatsappConfigRoutes");
const teamAssignmentRoutes = require("./teamAssignmentRoutes");

const router = express.Router();

// API Routes
router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);
router.use("/acara", acaraRoutes);
router.use("/report", reportRoutes);
router.use("/whatsapp-config", whatsappConfigRoutes);
router.use("/team-assignments", teamAssignmentRoutes);

// Health check route
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

module.exports = router;
