const express = require("express");
const router = express.Router();
const whatsappConfigController = require("../controllers/whatsappConfigController");

// GET /api/whatsapp-config - Get current WhatsApp configuration
router.get("/", whatsappConfigController.get);

// POST /api/whatsapp-config - Create or update WhatsApp configuration
router.post("/", whatsappConfigController.create);

// DELETE /api/whatsapp-config - Delete WhatsApp configuration
router.delete("/", whatsappConfigController.remove);

module.exports = router;
