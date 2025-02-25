const taskService = require("../services/taskService");
const {
  successResponse,
  errorResponse,
  validationErrorResponse,
} = require("../utils/responseHandler");

const VALID_STATUSES = ["COMPLETED", "CANCEL", "INPROGRESS", "BACKLOG"];
const VALID_CATEGORIES = [
  "MEMO",
  "TASK",
  "LAPORAN",
  "JASA",
  "MATERIAL",
  "TEMUAN",
];

const taskController = {
  /**
   * Get all tasks
   */
  getAllTasks: async (req, res) => {
    try {
      const tasks = await taskService.getAllTasks();
      return successResponse(res, 200, "Tasks retrieved successfully", tasks);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },

  /**
   * Get task by ID
   */
  getTaskById: async (req, res) => {
    try {
      const { id } = req.params;
      const task = await taskService.getTaskById(parseInt(id));
      if (!task) {
        return errorResponse(res, 404, "Task not found");
      }
      return successResponse(res, 200, "Task retrieved successfully", task);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },

  /**
   * Create new task
   */
  createTask: async (req, res) => {
    try {
      const { title, category, status, keterangan, sendWa, changedBy } =
        req.body;

      // Validate required fields
      if (!title) {
        return validationErrorResponse(res, "Title is required");
      }

      // Validate category
      if (!category || !VALID_CATEGORIES.includes(category)) {
        return validationErrorResponse(
          res,
          `Invalid category value. Must be one of: ${VALID_CATEGORIES.join(
            ", "
          )}`
        );
      }

      // Validate status if provided
      if (status && !VALID_STATUSES.includes(status)) {
        return validationErrorResponse(
          res,
          `Invalid status value. Must be one of: ${VALID_STATUSES.join(", ")}`
        );
      }

      const task = await taskService.createTask(
        {
          title,
          category,
          status,
          keterangan,
          sendWa,
        },
        changedBy || "System"
      );

      return successResponse(res, 201, "Task created successfully", task);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },

  /**
   * Update task
   */
  updateTask: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, category, status, keterangan, changedBy } = req.body;

      // Validate category if provided
      if (category && !VALID_CATEGORIES.includes(category)) {
        return validationErrorResponse(
          res,
          `Invalid category value. Must be one of: ${VALID_CATEGORIES.join(
            ", "
          )}`
        );
      }

      // Validate status if provided
      if (status && !VALID_STATUSES.includes(status)) {
        return validationErrorResponse(
          res,
          `Invalid status value. Must be one of: ${VALID_STATUSES.join(", ")}`
        );
      }

      const task = await taskService.updateTask(
        parseInt(id),
        {
          title,
          category,
          status,
          keterangan,
        },
        changedBy || "System"
      );

      if (!task) {
        return errorResponse(res, 404, "Task not found");
      }

      return successResponse(res, 200, "Task updated successfully", task);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },

  /**
   * Delete task
   */
  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;
      const task = await taskService.deleteTask(parseInt(id));
      if (!task) {
        return errorResponse(res, 404, "Task not found");
      }
      return successResponse(res, 200, "Task deleted successfully");
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },

  /**
   * Get tasks by status
   */
  getTasksByStatus: async (req, res) => {
    try {
      const { status } = req.params;

      if (!VALID_STATUSES.includes(status)) {
        return validationErrorResponse(
          res,
          `Invalid status value. Must be one of: ${VALID_STATUSES.join(", ")}`
        );
      }

      const tasks = await taskService.getTasksByStatus(status);
      return successResponse(res, 200, "Tasks retrieved successfully", tasks);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },

  /**
   * Get tasks by category
   */
  getTasksByCategory: async (req, res) => {
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

      const tasks = await taskService.getTasksByCategory(category);
      return successResponse(res, 200, "Tasks retrieved successfully", tasks);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },
};

module.exports = taskController;
