const express = require("express");
const router = express.Router();
const acaraController = require("../controllers/acaraController");

// Acara routes
router.get("/", acaraController.getAllAcara);
router.get("/:id", acaraController.getAcaraById);
router.post("/", acaraController.createAcara);
router.put("/:id", acaraController.updateAcara);
router.delete("/:id", acaraController.deleteAcara);

// Get acara by status
router.get("/status/:status", acaraController.getAcaraByStatus);

// Get upcoming acara (next 7 days)
router.get("/upcoming/week", acaraController.getUpcomingAcara);

// Get acara by date range
router.get("/date-range", acaraController.getAcaraByDateRange);

// Get acara by category
router.get("/category/:category", acaraController.getAcaraByCategory);

module.exports = router;
