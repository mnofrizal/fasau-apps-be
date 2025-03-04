const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

// Get all inventory items
router.get("/items", inventoryController.getAllItems);

// Get items by category
router.get("/items/category/:category", inventoryController.getItemsByCategory);

// Get item by ID
router.get("/items/:id", inventoryController.getItemById);

// Record batch movement (IN/OUT)
router.post("/movements/batch", inventoryController.recordBatchMovement);

// Get all transactions
router.get("/transactions", inventoryController.getAllTransactions);

// Get transaction by ID
router.get("/transactions/:id", inventoryController.getTransactionById);

// Get transaction by reference
router.get(
  "/transactions/reference/:reference",
  inventoryController.getTransactionByReference
);

module.exports = router;
