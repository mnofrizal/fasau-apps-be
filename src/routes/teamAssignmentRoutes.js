const express = require("express");
const router = express.Router();
const teamAssignmentController = require("../controllers/teamAssignmentController");

router.get("/today", teamAssignmentController.getTodayAssignment);
router.get("/date/:date", teamAssignmentController.getAssignmentByDate);

module.exports = router;
