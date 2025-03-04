const inventoryService = require("../services/inventoryService");
const responseHandler = require("../utils/responseHandler");

const inventoryController = {
  /**
   * Get all inventory items
   * GET /api/v1/inventory/items
   */
  getAllItems: async (req, res) => {
    try {
      const items = await inventoryService.getAllItems();
      responseHandler.successResponse(
        res,
        200,
        "Items retrieved successfully",
        items
      );
    } catch (error) {
      responseHandler.errorResponse(res, 500, error.message);
    }
  },

  /**
   * Get item by ID
   * GET /api/v1/inventory/items/:id
   */
  getItemById: async (req, res) => {
    try {
      const item = await inventoryService.getItemById(parseInt(req.params.id));
      if (!item) {
        return responseHandler.notFoundResponse(res, "Item not found");
      }
      responseHandler.successResponse(
        res,
        200,
        "Item retrieved successfully",
        item
      );
    } catch (error) {
      responseHandler.errorResponse(res, 500, error.message);
    }
  },

  /**
   * Record batch movement (IN/OUT)
   * POST /api/v1/inventory/movements/batch
   */
  recordBatchMovement: async (req, res) => {
    try {
      const transaction = await inventoryService.recordBatchMovement(req.body);
      responseHandler.successResponse(
        res,
        201,
        "Transaction recorded successfully",
        transaction
      );
    } catch (error) {
      responseHandler.errorResponse(res, 500, error.message);
    }
  },

  /**
   * Get all transactions
   * GET /api/v1/inventory/transactions
   */
  getAllTransactions: async (req, res) => {
    try {
      const transactions = await inventoryService.getAllTransactions();
      responseHandler.successResponse(
        res,
        200,
        "Transactions retrieved successfully",
        transactions
      );
    } catch (error) {
      responseHandler.errorResponse(res, 500, error.message);
    }
  },

  /**
   * Get transaction by ID
   * GET /api/v1/inventory/transactions/:id
   */
  getTransactionById: async (req, res) => {
    try {
      const transaction = await inventoryService.getTransactionById(
        parseInt(req.params.id)
      );
      if (!transaction) {
        return responseHandler.notFoundResponse(res, "Transaction not found");
      }
      responseHandler.successResponse(
        res,
        200,
        "Transaction retrieved successfully",
        transaction
      );
    } catch (error) {
      responseHandler.errorResponse(res, 500, error.message);
    }
  },

  /**
   * Get transaction by reference number
   * GET /api/v1/inventory/transactions/reference/:reference
   */
  /**
   * Get items by category
   * GET /api/v1/inventory/items/category/:category
   */
  getItemsByCategory: async (req, res) => {
    try {
      const items = await inventoryService.getItemsByCategory(
        req.params.category
      );
      responseHandler.successResponse(
        res,
        200,
        "Items retrieved successfully",
        items
      );
    } catch (error) {
      responseHandler.errorResponse(res, 500, error.message);
    }
  },

  getTransactionByReference: async (req, res) => {
    try {
      const transaction = await inventoryService.getTransactionByReference(
        req.params.reference
      );
      if (!transaction) {
        return responseHandler.notFoundResponse(res, "Transaction not found");
      }
      responseHandler.successResponse(
        res,
        200,
        "Transaction retrieved successfully",
        transaction
      );
    } catch (error) {
      responseHandler.errorResponse(res, 500, error.message);
    }
  },
};

module.exports = inventoryController;
