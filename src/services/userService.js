const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userService = {
  /**
   * Get all users
   * @returns {Promise<Array>} Array of users
   */
  getAllUsers: async () => {
    return await prisma.user.findMany();
  },

  /**
   * Get user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object>} User object
   */
  getUserById: async (id) => {
    return await prisma.user.findUnique({
      where: { id },
    });
  },

  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user object
   */
  createUser: async (userData) => {
    return await prisma.user.create({
      data: userData,
    });
  },

  /**
   * Update user
   * @param {number} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user object
   */
  updateUser: async (id, userData) => {
    return await prisma.user.update({
      where: { id },
      data: userData,
    });
  },

  /**
   * Delete user
   * @param {number} id - User ID
   * @returns {Promise<Object>} Deleted user object
   */
  deleteUser: async (id) => {
    return await prisma.user.delete({
      where: { id },
    });
  },
};

module.exports = userService;
