const { PrismaClient } = require("@prisma/client");
const socketUtils = require("../utils/socket");
const waApiService = require("./waApiService");
const whatsappConfigService = require("./whatsappConfigService");
const prisma = new PrismaClient();

const taskService = {
  /**
   * Get all tasks
   * @returns {Promise<Array>} Array of tasks with related report info if available
   */
  getAllTasks: async () => {
    return await prisma.task.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        taskReport: {
          select: {
            id: true,
            description: true,
            pelapor: true,
            phone: true,
            category: true,
            subCategory: true,
            evidence: true,
            tindakan: true,
          },
        },
        statusHistory: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            status: true,
            notes: true,
            changedBy: true,
            createdAt: true,
          },
        },
      },
    });
  },

  /**
   * Get task by ID
   * @param {number} id - Task ID
   * @returns {Promise<Object>} Task object with related report info if available
   */
  getTaskById: async (id) => {
    return await prisma.task.findUnique({
      where: { id },
      include: {
        taskReport: {
          select: {
            id: true,
            description: true,
            pelapor: true,
            phone: true,
            category: true,
            subCategory: true,
            evidence: true,
            tindakan: true,
          },
        },
        statusHistory: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            status: true,
            notes: true,
            changedBy: true,
            createdAt: true,
          },
        },
      },
    });
  },

  /**
   * Create new task
   * @param {Object} taskData - Task data
   * @param {string} [changedBy] - Identifier of the user creating the task
   * @returns {Promise<Object>} Created task object
   */
  createTask: async (taskData, changedBy = "System") => {
    // Extract sendWa flag and remove it from taskData
    const { sendWa, ...taskDataWithoutWa } = taskData;

    // Create task with initial status history
    const task = await prisma.task.create({
      data: {
        ...taskDataWithoutWa,
        statusHistory: {
          create: {
            status: taskDataWithoutWa.status || "INPROGRESS",
            notes: `Task created with status ${
              taskDataWithoutWa.status || "INPROGRESS"
            }`,
            changedBy: changedBy,
          },
        },
      },
      include: {
        statusHistory: true,
      },
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
   * @param {string} [changedBy] - Identifier of the user updating the task
   * @returns {Promise<Object>} Updated task object
   */
  updateTask: async (id, taskData, changedBy = "System") => {
    console.log(`Starting updateTask for ID: ${id} with data:`, taskData);

    // Get the existing task to check waMessageId, timestamp, and taskReportId
    const existingTask = await prisma.task.findUnique({
      where: { id },
      select: {
        waMessageId: true,
        createdAt: true,
        taskReportId: true,
        status: true,
      },
    });
    console.log(`Existing task data:`, existingTask);

    // Check if status is being updated
    const isStatusChanged =
      taskData.status && taskData.status !== existingTask.status;

    // Update the task
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...taskData,
        // If status is changing, create a status history entry
        ...(isStatusChanged && {
          statusHistory: {
            create: {
              status: taskData.status,
              notes: `Status changed from ${existingTask.status} to ${taskData.status}`,
              changedBy: changedBy,
            },
          },
        }),
      },
      include: {
        taskReport: true,
        statusHistory: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5, // Get the 5 most recent status changes
        },
      },
    });

    console.log(`Task updated in database:`, task);
    socketUtils.getIO().emit("task_updated"); // Emit event to refresh tasks after update

    // Sync status with associated report if status changed to COMPLETED or CANCEL
    if (
      existingTask?.taskReportId &&
      isStatusChanged &&
      (taskData.status === "COMPLETED" || taskData.status === "CANCEL")
    ) {
      try {
        // Update the associated report with the same status and create a status history entry
        await prisma.taskReport.update({
          where: { id: existingTask.taskReportId },
          data: {
            status: taskData.status,
            statusHistory: {
              create: {
                status: taskData.status,
                notes: `Status updated from task: ${task.title}`,
                changedBy: changedBy,
              },
            },
          },
        });

        console.log(
          `Updated associated report (ID: ${existingTask.taskReportId}) status to ${taskData.status}`
        );
        socketUtils.getIO().emit("report_created"); // Emit event to refresh reports
      } catch (error) {
        console.error(
          `Error updating associated report status: ${error.message}`
        );
        // Don't throw error, as task is already updated
      }
    }

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
   * @returns {Promise<Array>} Array of tasks with related report info if available
   */
  getTasksByStatus: async (status) => {
    return await prisma.task.findMany({
      where: { status },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        taskReport: {
          select: {
            id: true,
            description: true,
            pelapor: true,
            phone: true,
            category: true,
            subCategory: true,
          },
        },
        statusHistory: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            status: true,
            notes: true,
            changedBy: true,
            createdAt: true,
          },
          take: 5,
        },
      },
    });
  },

  /**
   * Get tasks by category
   * @param {string} category - Task category
   * @returns {Promise<Array>} Array of tasks with related report info if available
   */
  getTasksByCategory: async (category) => {
    return await prisma.task.findMany({
      where: { category },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        taskReport: {
          select: {
            id: true,
            description: true,
            pelapor: true,
            phone: true,
            category: true,
            subCategory: true,
          },
        },
        statusHistory: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            status: true,
            notes: true,
            changedBy: true,
            createdAt: true,
          },
          take: 5,
        },
      },
    });
  },
};

module.exports = taskService;
