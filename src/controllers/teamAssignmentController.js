const teamAssignmentService = require("../services/teamAssignmentService");
const { successResponse, errorResponse } = require("../utils/responseHandler");

class TeamAssignmentController {
  async getTodayAssignment(req, res) {
    try {
      const result = await teamAssignmentService.getTodayAssignment();
      const message = `Today's team assignments (${result.dayName}, Week ${result.weekNumber} in year, Cycle ${result.weekInCycle} - ${result.date})`;
      return successResponse(res, 200, message, result);
    } catch (error) {
      console.error("Error in getTodayAssignment:", error);
      if (error.message.includes("No assignments")) {
        return errorResponse(res, 404, error.message);
      }
      return errorResponse(res, 500, "Internal server error");
    }
  }

  async getAssignmentByDate(req, res) {
    try {
      const { date } = req.params;
      const result = await teamAssignmentService.getAssignmentForDate(date);
      const message = `Team assignments for ${date} (${result.dayName}, Week ${result.weekNumber} in year, Cycle ${result.weekInCycle})`;
      return successResponse(res, 200, message, result);
    } catch (error) {
      console.error("Error in getAssignmentByDate:", error);
      if (error.message.includes("Invalid date format")) {
        return errorResponse(res, 400, error.message);
      }
      if (error.message.includes("No assignments")) {
        return errorResponse(res, 404, error.message);
      }
      return errorResponse(res, 500, "Internal server error");
    }
  }
}

module.exports = new TeamAssignmentController();
