const pmService = require("../services/pmService");
const { successResponse, errorResponse } = require("../utils/responseHandler");

const pmController = {
  /**
   * Send today's PM schedule manually
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  sendTodayPMSchedule: async (req, res) => {
    try {
      const { groupOnly = false } = req.body;
      const options = { groupOnly };

      const result = await pmService.sendPMSchedule(new Date(), options);

      if (result.success) {
        return successResponse(res, 200, result.message, result.data);
      } else {
        return errorResponse(res, 400, result.message, result.error);
      }
    } catch (error) {
      console.error("Error in sendTodayPMSchedule:", error);
      return errorResponse(res, 500, "Internal server error", error.message);
    }
  },

  /**
   * Send PM schedule for a specific date
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  sendPMScheduleByDate: async (req, res) => {
    try {
      const { date } = req.body;

      if (!date) {
        return errorResponse(
          res,
          400,
          "Date is required",
          "Please provide a date in YYYY-MM-DD format"
        );
      }

      // Validate date format
      const targetDate = new Date(date);
      if (isNaN(targetDate.getTime())) {
        return errorResponse(
          res,
          400,
          "Invalid date format",
          "Please provide a valid date in YYYY-MM-DD format"
        );
      }

      const result = await pmService.sendPMSchedule(targetDate);

      if (result.success) {
        return successResponse(res, 200, result.message, result.data);
      } else {
        return errorResponse(res, 400, result.message, result.error);
      }
    } catch (error) {
      console.error("Error in sendPMScheduleByDate:", error);
      return errorResponse(res, 500, "Internal server error", error.message);
    }
  },

  /**
   * Get today's PM assignments without sending messages
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getTodayPMAssignments: async (req, res) => {
    try {
      const result = pmService.getTodayPMAssignments();

      if (result.success) {
        return successResponse(res, 200, result.message, result.data);
      } else {
        return errorResponse(res, 404, result.message);
      }
    } catch (error) {
      console.error("Error in getTodayPMAssignments:", error);
      return errorResponse(res, 500, "Internal server error", error.message);
    }
  },

  /**
   * Get PM assignments for a specific date without sending messages
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getPMAssignmentsByDate: async (req, res) => {
    try {
      const { date } = req.params;

      if (!date) {
        return errorResponse(
          res,
          400,
          "Date is required",
          "Please provide a date in YYYY-MM-DD format"
        );
      }

      // Validate date format
      const targetDate = new Date(date);
      if (isNaN(targetDate.getTime())) {
        return errorResponse(
          res,
          400,
          "Invalid date format",
          "Please provide a valid date in YYYY-MM-DD format"
        );
      }

      const result = pmService.getTodayPMAssignments(targetDate);

      if (result.success) {
        return successResponse(res, 200, result.message, result.data);
      } else {
        return errorResponse(res, 404, result.message);
      }
    } catch (error) {
      console.error("Error in getPMAssignmentsByDate:", error);
      return errorResponse(res, 500, "Internal server error", error.message);
    }
  },
};

module.exports = pmController;
