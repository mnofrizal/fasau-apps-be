const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const taskService = {
  /**
   * Get all tasks
   * @returns {Promise<Array>} Array of tasks
   */
  getAllTasks: async () => {
    return await prisma.task.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  /**
   * Get task by ID
   * @param {number} id - Task ID
   * @returns {Promise<Object>} Task object
   */
  getTaskById: async (id) => {
    return await prisma.task.findUnique({
      where: { id },
    });
  },

  /**
   * Create new task
   * @param {Object} taskData - Task data
   * @returns {Promise<Object>} Created task object
   */
  createTask: async (taskData) => {
    return await prisma.task.create({
      data: taskData,
    });
  },

  /**
   * Update task
   * @param {number} id - Task ID
   * @param {Object} taskData - Updated task data
   * @returns {Promise<Object>} Updated task object
   */
  updateTask: async (id, taskData) => {
    return await prisma.task.update({
      where: { id },
      data: taskData,
    });
  },

  /**
   * Delete task
   * @param {number} id - Task ID
   * @returns {Promise<Object>} Deleted task object
   */
  deleteTask: async (id) => {
    return await prisma.task.delete({
      where: { id },
    });
  },

  /**
   * Get tasks by status
   * @param {string} status - Task status
   * @returns {Promise<Array>} Array of tasks
   */
  getTasksByStatus: async (status) => {
    return await prisma.task.findMany({
      where: { status },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  /**
   * Get tasks by category
   * @param {string} category - Task category
   * @returns {Promise<Array>} Array of tasks
   */
  getTasksByCategory: async (category) => {
    return await prisma.task.findMany({
      where: { category },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
};

module.exports = taskService;
