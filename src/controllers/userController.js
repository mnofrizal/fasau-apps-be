const userService = require("../services/userService");
const { successResponse, errorResponse } = require("../utils/responseHandler");

const userController = {
  /**
   * Get all users
   */
  getAllUsers: async (req, res) => {
    try {
      const users = await userService.getAllUsers();
      return successResponse(res, 200, "Users retrieved successfully", users);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },

  /**
   * Get user by ID
   */
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(parseInt(id));
      if (!user) {
        return errorResponse(res, 404, "User not found");
      }
      return successResponse(res, 200, "User retrieved successfully", user);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },

  /**
   * Create new user
   */
  createUser: async (req, res) => {
    try {
      const userData = req.body;
      const user = await userService.createUser(userData);
      return successResponse(res, 201, "User created successfully", user);
    } catch (error) {
      if (error.code === "P2002") {
        return errorResponse(res, 400, "Email already exists");
      }
      return errorResponse(res, 500, error.message);
    }
  },

  /**
   * Update user
   */
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const userData = req.body;
      const user = await userService.updateUser(parseInt(id), userData);
      if (!user) {
        return errorResponse(res, 404, "User not found");
      }
      return successResponse(res, 200, "User updated successfully", user);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },

  /**
   * Delete user
   */
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await userService.deleteUser(parseInt(id));
      if (!user) {
        return errorResponse(res, 404, "User not found");
      }
      return successResponse(res, 200, "User deleted successfully");
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },
};

module.exports = userController;
