const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

// Get all inventory items
router.get("/items", inventoryController.getAllItems);

// Create new item
router.post("/items", inventoryController.createItem);

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

// Update item
router.put("/items/:id", inventoryController.updateItem);

// Delete item
router.delete("/items/:id", inventoryController.deleteItem);

// Update transaction
router.put("/transactions/:id", inventoryController.updateTransaction);

// Delete transaction
router.delete("/transactions/:id", inventoryController.deleteTransaction);

module.exports = router;
