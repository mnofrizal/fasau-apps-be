const express = require("express");
const pmController = require("../controllers/pmController");

const router = express.Router();

// POST /api/v1/pm/send-today - Send today's PM schedule manually
router.post("/send-today", pmController.sendTodayPMSchedule);

// POST /api/v1/pm/send-by-date - Send PM schedule for a specific date
router.post("/send-by-date", pmController.sendPMScheduleByDate);

// GET /api/v1/pm/assignments/today - Get today's PM assignments without sending
router.get("/assignments/today", pmController.getTodayPMAssignments);

// GET /api/v1/pm/assignments/:date - Get PM assignments for a specific date without sending
router.get("/assignments/:date", pmController.getPMAssignmentsByDate);

module.exports = router;
