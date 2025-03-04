const { PrismaClient } = require("@prisma/client");
const socketUtils = require("../utils/socket");
const prisma = new PrismaClient();
const { TaskCategory, ItemUnit } = require("@prisma/client");

/**
 * Helper function to find or create inventory items
 * @param {Array} materials - Array of material items with name, category, etc.
 * @returns {Promise<Array>} Array of processed inventory items with IDs
 */
const processInventoryItems = async (materials) => {
  if (!materials || !Array.isArray(materials)) return [];

  const processedItems = await Promise.all(
    materials.map(async (item) => {
      // Find existing item
      let inventoryItem = await prisma.inventoryItem.findFirst({
        where: {
          name: item.name,
          category: item.category,
        },
      });

      // If not found, create new item with quantity 0
      if (!inventoryItem) {
        inventoryItem = await prisma.inventoryItem.create({
          data: {
            name: item.name,
            category: item.category,
            quantity: 0,
            unit: item.unit,
            location: item.location || "Gudang Eks Golf",
          },
        });
      }

      // Return the item with requested quantity
      return {
        id: inventoryItem.id,
        name: inventoryItem.name,
        category: inventoryItem.category,
        quantity: item.quantity,
        unit: inventoryItem.unit,
        location: item.location || inventoryItem.location,
      };
    })
  );

  return processedItems;
};

const reportService = {
  /**
   * Get all reports
   * @returns {Promise<Array>} Array of reports with related task info if escalated
   */
  getAllReports: async () => {
    return await prisma.taskReport.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        escalatedToTask: {
          select: {
            id: true,
            title: true,
            status: true,
            category: true,
            isUrgent: true,
            createdAt: true,
            updatedAt: true,
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
   * Get report by ID
   * @param {number} id - Report ID
   * @returns {Promise<Object>} Report object with related task info if escalated
   */
  getReportById: async (id) => {
    return await prisma.taskReport.findUnique({
      where: { id },
      include: {
        escalatedToTask: {
          select: {
            id: true,
            title: true,
            status: true,
            category: true,
            isUrgent: true,
            createdAt: true,
            updatedAt: true,
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
          take: 5, // Get the 5 most recent changes
        },
      },
    });
  },

  /**
   * Create new report
   * @param {Object} reportData - Report data
   * @param {string} [changedBy] - Identifier of the person creating the report
   * @returns {Promise<Object>} Created report object
   */
  createReport: async (reportData, changedBy = "System") => {
    // Process materials if provided
    let processedMaterials = [];
    if (reportData.material) {
      processedMaterials = await processInventoryItems(reportData.material);
    }

    // First create the report with its status history and processed materials
    const report = await prisma.taskReport.create({
      data: {
        ...reportData,
        material:
          processedMaterials.length > 0 ? processedMaterials : undefined,
        statusHistory: {
          create: {
            status: reportData.status || "BACKLOG",
            notes: `Report created with status ${
              reportData.status || "BACKLOG"
            }`,
            changedBy: changedBy || reportData.pelapor,
          },
        },
      },
      include: {
        statusHistory: true,
      },
    });

    socketUtils.getIO().emit("report_created"); // Emit event to refresh reports

    // If subCategory is TEMUAN, automatically escalate to task
    if (reportData.subCategory === "TEMUAN") {
      // Now escalate using the same prisma instance
      const task = await prisma.task.create({
        data: {
          title:
            report.description.length > 100
              ? `${report.description.substring(0, 97)}...`
              : report.description,
          category: "TEMUAN",
          status: "BACKLOG",
          keterangan: `${report.description}`,
          // isUrgent: true,
          taskReport: {
            connect: { id: report.id },
          },
          statusHistory: {
            create: {
              status: "BACKLOG",
              notes: `Tugas dibuat dari laporan #${report.id} dengan status BACKLOG`,
              changedBy: changedBy,
            },
          },
        },
      });

      // Update the report to mark it as escalated
      const updatedReport = await prisma.taskReport.update({
        where: { id: report.id },
        data: {
          isEscalated: true,
          statusHistory: {
            create: {
              status: report.status,
              notes: `Laporan di-escalate menjadi tugas #${task.id}`,
              changedBy: changedBy,
            },
          },
        },
        include: {
          escalatedToTask: true,
          statusHistory: {
            orderBy: {
              createdAt: "desc",
            },
            take: 5,
          },
        },
      });

      socketUtils.getIO().emit("task_updated");
      return updatedReport;
    }

    return report;
  },

  /**
   * Update report
   * @param {number} id - Report ID
   * @param {Object} reportData - Updated report data
   * @param {string} [changedBy] - Identifier of the person updating the report
   * @returns {Promise<Object>} Updated report object
   */
  updateReport: async (id, reportData, changedBy = "System") => {
    // Process materials if provided
    let processedMaterials = [];
    if (reportData.material) {
      processedMaterials = await processInventoryItems(reportData.material);
      reportData.material = processedMaterials;
    }

    // Get the existing report to check current status and subCategory
    const existingReport = await prisma.taskReport.findUnique({
      where: { id },
      select: {
        status: true,
        pelapor: true,
        subCategory: true,
        isEscalated: true,
        description: true,
        phone: true,
        category: true,
      },
    });

    if (!existingReport) {
      throw new Error("Report not found");
    }

    // Check if status is being updated
    const isStatusChanged =
      reportData.status && reportData.status !== existingReport.status;

    // Check if subCategory is being changed to TEMUAN
    const isChangingToTemuan =
      reportData.subCategory === "TEMUAN" &&
      reportData.subCategory !== existingReport.subCategory &&
      !existingReport.isEscalated;

    // Update the report
    const report = await prisma.taskReport.update({
      where: { id },
      data: reportData,
    });

    // If status changed, create a new status history entry
    if (isStatusChanged) {
      await prisma.statusHistory.create({
        data: {
          status: reportData.status,
          notes: `Status diubah dari ${existingReport.status} menjadi ${reportData.status}`,
          changedBy: changedBy,
          report: {
            connect: { id: report.id },
          },
        },
      });
    }

    // If being changed to TEMUAN, automatically escalate to task
    if (isChangingToTemuan) {
      // Create a task
      const task = await prisma.task.create({
        data: {
          title:
            report.description.length > 100
              ? `${report.description.substring(0, 97)}...`
              : report.description,
          category: "TEMUAN",
          status: "BACKLOG",
          keterangan: `${report.description}`,
          // isUrgent: true,
          taskReport: {
            connect: { id: report.id },
          },
          statusHistory: {
            create: {
              status: "BACKLOG",
              notes: `Tugas dibuat dari laporan #${report.id} dengan status BACKLOG`,
              changedBy: changedBy,
            },
          },
        },
      });

      // Update the report to mark it as escalated
      await prisma.taskReport.update({
        where: { id: report.id },
        data: {
          isEscalated: true,
          statusHistory: {
            create: {
              status: report.status,
              notes: `Laporan di-escalate menjadi tugas #${task.id} setelah ditandai sebagai TEMUAN`,
              changedBy: changedBy,
            },
          },
        },
      });

      socketUtils.getIO().emit("task_updated");
    }

    // Get the final updated report with related data
    const updatedReport = await prisma.taskReport.findUnique({
      where: { id },
      include: {
        escalatedToTask: true,
        statusHistory: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5, // Get the 5 most recent status changes
        },
      },
    });

    socketUtils.getIO().emit("report_created"); // Emit event to refresh reports after update
    return updatedReport;
  },

  /**
   * Delete report
   * @param {number} id - Report ID
   * @returns {Promise<Object>} Deleted report object
   */
  deleteReport: async (id) => {
    const report = await prisma.taskReport.delete({
      where: { id },
    });
    socketUtils.getIO().emit("report_created"); // Emit event to refresh reports after deletion
    return report;
  },

  /**
   * Get reports by category
   * @param {string} category - Report category
   * @returns {Promise<Array>} Array of reports with related task info if escalated
   */
  getReportsByCategory: async (category) => {
    return await prisma.taskReport.findMany({
      where: { category },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        escalatedToTask: {
          select: {
            id: true,
            title: true,
            status: true,
            category: true,
            isUrgent: true,
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
   * Get reports by pelapor
   * @param {string} pelapor - Reporter name
   * @returns {Promise<Array>} Array of reports with related task info if escalated
   */
  getReportsByPelapor: async (pelapor) => {
    return await prisma.taskReport.findMany({
      where: { pelapor },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        escalatedToTask: {
          select: {
            id: true,
            title: true,
            status: true,
            category: true,
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
   * Search reports
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of matching reports with related task info if escalated
   */
  searchReports: async (query) => {
    return await prisma.taskReport.findMany({
      where: {
        OR: [
          { description: { contains: query, mode: "insensitive" } },
          { pelapor: { contains: query, mode: "insensitive" } },
          { evidence: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        escalatedToTask: {
          select: {
            id: true,
            title: true,
            status: true,
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
   * Get today's reports
   * @returns {Promise<Array>} Array of today's reports with related task info if escalated
   */
  getTodayReports: async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await prisma.taskReport.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        escalatedToTask: {
          select: {
            id: true,
            title: true,
            status: true,
            category: true,
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
   * Escalate a report to a task
   * @param {number} id - Report ID to escalate
   * @param {string} [changedBy] - Identifier of the person escalating the report
   * @returns {Promise<Object>} Created task object and updated report
   */
  escalateReportToTask: async (id, changedBy = "System") => {
    // 1. Get the report
    const report = await prisma.taskReport.findUnique({
      where: { id },
    });

    if (!report) {
      throw new Error("Report not found");
    }

    // Check if report is already escalated
    if (report.isEscalated) {
      throw new Error("Report is already escalated to a task");
    }

    // 2. Create a task based on the report with initial status history
    const task = await prisma.task.create({
      data: {
        // Use the report description as the title, but limit it if it's too long
        title:
          report.description.length > 100
            ? `${report.description.substring(0, 97)}...`
            : report.description,

        // Set category based on subCategory
        category: report.subCategory === "TEMUAN" ? "TEMUAN" : "LAPORAN",

        status: "BACKLOG",

        // Include additional details in keterangan
        keterangan: `${report.description}`,

        // Set urgency flag for TEMUAN
        // isUrgent: report.subCategory === "TEMUAN",

        // Link back to the report
        taskReport: {
          connect: { id: report.id },
        },

        // Create initial status history
        statusHistory: {
          create: {
            status: "BACKLOG",
            notes: `Tugas dibuat dari laporan #${report.id} dengan status BACKLOG`,
            changedBy: changedBy,
          },
        },
      },
      include: {
        statusHistory: true,
      },
    });

    // 3. Update the report to mark it as escalated with status history entry
    const updatedReport = await prisma.taskReport.update({
      where: { id },
      data: {
        isEscalated: true,
        statusHistory: {
          create: {
            status: report.status,
            notes: `Laporan di-escalate menjadi tugas #${task.id}`,
            changedBy: changedBy,
          },
        },
      },
      include: {
        statusHistory: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
      },
    });

    // Emit events to refresh both tasks and reports
    socketUtils.getIO().emit("task_updated");
    socketUtils.getIO().emit("report_created");

    return { task, report: updatedReport };
  },
};

module.exports = reportService;
