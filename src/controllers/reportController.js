const reportService = require("../services/reportService");
const {
  successResponse,
  errorResponse,
  validationErrorResponse,
} = require("../utils/responseHandler");

const VALID_CATEGORIES = [
  "CM",
  "PM",
  "AC",
  "MK",
  "TIJ",
  "TDP",
  "JSI",
  "PMT",
  "PST",
];
const VALID_SUBCATEGORIES = ["LAPORAN", "TEMUAN"];

const reportController = {
  /**
   * Get all reports
   */
  getAllReports: async (req, res) => {
    try {
      const reports = await reportService.getAllReports();
      return successResponse(
        res,
        200,
        "Reports retrieved successfully",
        reports
      );
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },

  /**
   * Get report by ID
   */
  getReportById: async (req, res) => {
    try {
      const { id } = req.params;
      const report = await reportService.getReportById(parseInt(id));
      if (!report) {
        return errorResponse(res, 404, "Report not found");
      }
      return successResponse(res, 200, "Report retrieved successfully", report);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },

  /**
   * Create new report
   */
  createReport: async (req, res) => {
    try {
      const {
        evidence,
        description,
        pelapor,
        phone,
        category,
        subCategory,
        tindakan,
        status,
      } = req.body;

      // Validate required fields
      if (!description || !pelapor || !phone || !category) {
        return validationErrorResponse(
          res,
          "Description, pelapor, phone, and category are required"
        );
      }

      // Validate phone number format (simple validation)
      if (!phone.match(/^[0-9+\-\s()]+$/)) {
        return validationErrorResponse(res, "Invalid phone number format");
      }

      // Validate category
      if (!VALID_CATEGORIES.includes(category)) {
        return validationErrorResponse(
          res,
          `Invalid category value. Must be one of: ${VALID_CATEGORIES.join(
            ", "
          )}`
        );
      }

      // Validate subCategory if provided
      if (subCategory && !VALID_SUBCATEGORIES.includes(subCategory)) {
        return validationErrorResponse(
          res,
          `Invalid subCategory value. Must be one of: ${VALID_SUBCATEGORIES.join(
            ", "
          )}`
        );
      }

      // Validate status if provided
      const VALID_STATUSES = ["COMPLETED", "CANCEL", "INPROGRESS", "BACKLOG"];
      if (status && !VALID_STATUSES.includes(status)) {
        return validationErrorResponse(
          res,
          `Invalid status value. Must be one of: ${VALID_STATUSES.join(", ")}`
        );
      }

      const report = await reportService.createReport({
        evidence,
        description,
        pelapor,
        phone,
        category,
        subCategory,
        tindakan,
        status,
      });

      return successResponse(res, 201, "Report created successfully", report);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },

  /**
   * Update report
   */
  updateReport: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        evidence,
        description,
        pelapor,
        phone,
        category,
        subCategory,
        tindakan,
        status,
      } = req.body;

      // Validate phone number if provided
      if (phone && !phone.match(/^[0-9+\-\s()]+$/)) {
        return validationErrorResponse(res, "Invalid phone number format");
      }

      // Validate category if provided
      if (category && !VALID_CATEGORIES.includes(category)) {
        return validationErrorResponse(
          res,
          `Invalid category value. Must be one of: ${VALID_CATEGORIES.join(
            ", "
          )}`
        );
      }

      // Validate subCategory if provided
      if (subCategory && !VALID_SUBCATEGORIES.includes(subCategory)) {
        return validationErrorResponse(
          res,
          `Invalid subCategory value. Must be one of: ${VALID_SUBCATEGORIES.join(
            ", "
          )}`
        );
      }

      // Validate status if provided
      const VALID_STATUSES = ["COMPLETED", "CANCEL", "INPROGRESS", "BACKLOG"];
      if (status && !VALID_STATUSES.includes(status)) {
        return validationErrorResponse(
          res,
          `Invalid status value. Must be one of: ${VALID_STATUSES.join(", ")}`
        );
      }

      const report = await reportService.updateReport(parseInt(id), {
        evidence,
        description,
        pelapor,
        phone,
        category,
        subCategory,
        tindakan,
        status,
      });

      if (!report) {
        return errorResponse(res, 404, "Report not found");
      }

      return successResponse(res, 200, "Report updated successfully", report);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },

  /**
   * Delete report
   */
  deleteReport: async (req, res) => {
    try {
      const { id } = req.params;
      const report = await reportService.deleteReport(parseInt(id));
      if (!report) {
        return errorResponse(res, 404, "Report not found");
      }
      return successResponse(res, 200, "Report deleted successfully");
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },

  /**
   * Get reports by category
   */
  getReportsByCategory: async (req, res) => {
    try {
      const { category } = req.params;

      if (!VALID_CATEGORIES.includes(category)) {
        return validationErrorResponse(
          res,
          `Invalid category value. Must be one of: ${VALID_CATEGORIES.join(
            ", "
          )}`
        );
      }

      const reports = await reportService.getReportsByCategory(category);
      return successResponse(
        res,
        200,
        "Reports retrieved successfully",
        reports
      );
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },

  /**
   * Get reports by pelapor
   */
  getReportsByPelapor: async (req, res) => {
    try {
      const { pelapor } = req.params;
      const reports = await reportService.getReportsByPelapor(pelapor);
      return successResponse(
        res,
        200,
        "Reports retrieved successfully",
        reports
      );
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },

  /**
   * Search reports
   */
  searchReports: async (req, res) => {
    try {
      const { query } = req.query;

      if (!query) {
        return validationErrorResponse(res, "Search query is required");
      }

      const reports = await reportService.searchReports(query);
      return successResponse(
        res,
        200,
        "Reports retrieved successfully",
        reports
      );
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },

  /**
   * Get today's reports
   */
  getTodayReports: async (req, res) => {
    try {
      const reports = await reportService.getTodayReports();
      return successResponse(
        res,
        200,
        "Today's reports retrieved successfully",
        reports
      );
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },
};

module.exports = reportController;
