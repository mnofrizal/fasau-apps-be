const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// Task routes
router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getTaskById);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

// Get tasks by status
router.get("/status/:status", taskController.getTasksByStatus);

// Get tasks by category
router.get("/category/:category", taskController.getTasksByCategory);

module.exports = router;
