const { PrismaClient } = require("@prisma/client");
const socketUtils = require("../utils/socket");
const waApiService = require("./waApiService");
const whatsappConfigService = require("./whatsappConfigService");
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
    // Extract sendWa flag and remove it from taskData
    const { sendWa, ...taskDataWithoutWa } = taskData;

    const task = await prisma.task.create({
      data: taskDataWithoutWa,
    });
    socketUtils.getIO().emit("task_updated"); // Emit event to refresh tasks

    // If sendWa is true, send WhatsApp notification
    if (sendWa) {
      try {
        // Get WhatsApp configuration
        const waConfig = await whatsappConfigService.getConfig();
        if (!waConfig) {
          console.error("WhatsApp configuration not found");
          return task;
        }

        // Get count of tasks (TASK + LAPORAN)
        const taskCount = await prisma.task.count({
          where: {
            category: {
              in: ["TASK", "LAPORAN"],
            },
          },
        });

        // Send template message and get response
        const waResponse = await waApiService.sendTemplateMessage(
          "fasauSendTaskToGrup",
          {
            title: task.title,
            keterangan: task.keterangan,
            count: taskCount,
          },
          waConfig.groupId
        );

        // Update task with waMessageId if message was sent successfully
        if (waResponse.success && waResponse.data.messageId) {
          await prisma.task.update({
            where: { id: task.id },
            data: { waMessageId: waResponse.data.messageId },
          });
        }
      } catch (error) {
        console.error("Error sending WhatsApp notification:", error);
        // Don't throw error, as task is already created
      }
    }

    return task;
  },

  /**
   * Update task
   * @param {number} id - Task ID
   * @param {Object} taskData - Updated task data
   * @returns {Promise<Object>} Updated task object
   */
  updateTask: async (id, taskData) => {
    console.log(`Starting updateTask for ID: ${id} with data:`, taskData);

    // Get the existing task to check waMessageId and timestamp
    const existingTask = await prisma.task.findUnique({
      where: { id },
      select: {
        waMessageId: true,
        createdAt: true,
      },
    });
    console.log(`Existing task data:`, existingTask);

    const task = await prisma.task.update({
      where: { id },
      data: taskData,
    });
    console.log(`Task updated in database:`, task);
    socketUtils.getIO().emit("task_updated"); // Emit event to refresh tasks after update

    // Check if we have waMessageId and if the message is less than 12 minutes old
    if (existingTask?.waMessageId) {
      const messageAge = Date.now() - existingTask.createdAt.getTime();
      const twelveMinutesInMs = 12 * 60 * 1000;

      if (messageAge <= twelveMinutesInMs) {
        try {
          // Get WhatsApp configuration
          const waConfig = await whatsappConfigService.getConfig();
          if (!waConfig) {
            console.error("WhatsApp configuration not found");
            return task;
          }
          console.log(`WhatsApp configuration:`, waConfig);

          // Get count of tasks (TASK + LAPORAN)
          const taskCount = await prisma.task.count({
            where: {
              category: {
                in: ["TASK", "LAPORAN"],
              },
            },
          });
          console.log(`Count of tasks (TASK + LAPORAN):`, taskCount);

          // Send update template message
          const waResponse = await waApiService.sendUpdateTemplateMessage(
            existingTask.waMessageId,
            "fasauSendTaskToGrup",
            {
              title: task.title,
              keterangan: task.keterangan,
              count: taskCount,
            },
            waConfig.groupId
          );
          console.log(`WhatsApp update template message response:`, waResponse);
        } catch (error) {
          console.error("Error updating WhatsApp message:", error);
          // Don't throw error, as task is already updated
        }
      }
    }

    console.log(`Finished updateTask for ID: ${id}`);
    return task;
  },

  /**
   * Delete task
   * @param {number} id - Task ID
   * @returns {Promise<Object>} Deleted task object
   */
  deleteTask: async (id) => {
    // Get the task first to check waMessageId and timestamp
    const task = await prisma.task.findUnique({
      where: { id },
      select: {
        id: true,
        waMessageId: true,
        createdAt: true,
      },
    });

    // If the task has a waMessageId, check if it's less than 30 minutes old
    if (task?.waMessageId) {
      const messageAge = Date.now() - task.createdAt.getTime();
      const thirtyMinutesInMs = 30 * 60 * 1000;

      if (messageAge <= thirtyMinutesInMs) {
        try {
          // Delete the WhatsApp message
          await waApiService.deleteMessage(task.waMessageId);
        } catch (error) {
          console.error("Error deleting WhatsApp message:", error);
          // Continue with task deletion even if WhatsApp delete fails
        }
      }
    }

    // Delete the task
    const deletedTask = await prisma.task.delete({
      where: { id },
    });
    socketUtils.getIO().emit("task_updated"); // Emit event to refresh tasks after deletion
    return deletedTask;
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
