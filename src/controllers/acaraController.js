const acaraService = require("../services/acaraService");
const {
  successResponse,
  errorResponse,
  validationErrorResponse,
} = require("../utils/responseHandler");

const VALID_STATUSES = ["UPCOMING", "DONE", "CANCEL"];

const acaraController = {
  /**
   * Get all acara
   */
  getAllAcara: async (req, res) => {
    try {
      const acara = await acaraService.getAllAcara();
      return successResponse(res, 200, "Acara retrieved successfully", acara);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },

  /**
   * Get acara by ID
   */
  getAcaraById: async (req, res) => {
    try {
      const { id } = req.params;
      const acara = await acaraService.getAcaraById(parseInt(id));
      if (!acara) {
        return errorResponse(res, 404, "Acara not found");
      }
      return successResponse(res, 200, "Acara retrieved successfully", acara);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },

  /**
   * Create new acara
   */
  createAcara: async (req, res) => {
    try {
      const { title, dateTime, location, status, description, category } =
        req.body;

      // Validate required fields
      if (!title || !dateTime || !location) {
        return validationErrorResponse(
          res,
          "Title, dateTime, and location are required"
        );
      }

      // Validate date format
      const date = new Date(dateTime);
      if (isNaN(date.getTime())) {
        return validationErrorResponse(res, "Invalid dateTime format");
      }

      // Validate status if provided
      if (status && !VALID_STATUSES.includes(status)) {
        return validationErrorResponse(
          res,
          `Invalid status value. Must be one of: ${VALID_STATUSES.join(", ")}`
        );
      }

      const acara = await acaraService.createAcara({
        title,
        dateTime: date,
        location,
        status,
        description,
        category,
      });

      return successResponse(res, 201, "Acara created successfully", acara);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },

  /**
   * Update acara
   */
  updateAcara: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, dateTime, location, status, description, category } =
        req.body;

      // Validate date format if provided
      if (dateTime) {
        const date = new Date(dateTime);
        if (isNaN(date.getTime())) {
          return validationErrorResponse(res, "Invalid dateTime format");
        }
      }

      // Validate status if provided
      if (status && !VALID_STATUSES.includes(status)) {
        return validationErrorResponse(
          res,
          `Invalid status value. Must be one of: ${VALID_STATUSES.join(", ")}`
        );
      }

      const acara = await acaraService.updateAcara(parseInt(id), {
        title,
        dateTime: dateTime ? new Date(dateTime) : undefined,
        location,
        status,
        description,
        category,
      });

      if (!acara) {
        return errorResponse(res, 404, "Acara not found");
      }

      return successResponse(res, 200, "Acara updated successfully", acara);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },

  /**
   * Delete acara
   */
  deleteAcara: async (req, res) => {
    try {
      const { id } = req.params;
      const acara = await acaraService.deleteAcara(parseInt(id));
      if (!acara) {
        return errorResponse(res, 404, "Acara not found");
      }
      return successResponse(res, 200, "Acara deleted successfully");
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },

  /**
   * Get acara by status
   */
  getAcaraByStatus: async (req, res) => {
    try {
      const { status } = req.params;

      if (!VALID_STATUSES.includes(status)) {
        return validationErrorResponse(
          res,
          `Invalid status value. Must be one of: ${VALID_STATUSES.join(", ")}`
        );
      }

      const acara = await acaraService.getAcaraByStatus(status);
      return successResponse(res, 200, "Acara retrieved successfully", acara);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },

  /**
   * Get upcoming acara (next 7 days)
   */
  getUpcomingAcara: async (req, res) => {
    try {
      const acara = await acaraService.getUpcomingAcara();
      return successResponse(
        res,
        200,
        "Upcoming acara retrieved successfully",
        acara
      );
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },

  /**
   * Get acara by date range
   */
  getAcaraByDateRange: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return validationErrorResponse(
          res,
          "Start date and end date are required"
        );
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return validationErrorResponse(res, "Invalid date format");
      }

      const acara = await acaraService.getAcaraByDateRange(start, end);
      return successResponse(res, 200, "Acara retrieved successfully", acara);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },

  /**
   * Get acara by category
   */
  getAcaraByCategory: async (req, res) => {
    try {
      const { category } = req.params;
      const acara = await acaraService.getAcaraByCategory(category);
      return successResponse(res, 200, "Acara retrieved successfully", acara);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },
};

module.exports = acaraController;
