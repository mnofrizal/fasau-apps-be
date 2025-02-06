const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

// Report routes
router.get("/", reportController.getAllReports);
router.get("/:id", reportController.getReportById);
router.post("/", reportController.createReport);
router.put("/:id", reportController.updateReport);
router.delete("/:id", reportController.deleteReport);

// Get reports by category
router.get("/category/:category", reportController.getReportsByCategory);

// Get reports by pelapor
router.get("/pelapor/:pelapor", reportController.getReportsByPelapor);

// Search reports
router.get("/search", reportController.searchReports);

// Get today's reports
router.get("/filter/today", reportController.getTodayReports);

module.exports = router;
