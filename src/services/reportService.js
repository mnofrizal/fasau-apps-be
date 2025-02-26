const { PrismaClient } = require("@prisma/client");
const socketUtils = require("../utils/socket");
const prisma = new PrismaClient();
const { TaskCategory } = require("@prisma/client");

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
    // First create the report with its status history
    const report = await prisma.taskReport.create({
      data: {
        ...reportData,
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
          keterangan: `Pelapor: ${report.pelapor}\n\nDeskripsi: ${report.description}`,
          // isUrgent: true,
          taskReport: {
            connect: { id: report.id },
          },
          statusHistory: {
            create: {
              status: "BACKLOG",
              notes: `Task created from report #${report.id} with status BACKLOG`,
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
              notes: `Report escalated to task #${task.id}`,
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
          notes: `Status changed from ${existingReport.status} to ${reportData.status}`,
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
          keterangan: `Pelapor: ${report.pelapor}\n\nDeskripsi: ${report.description}`,
          // isUrgent: true,
          taskReport: {
            connect: { id: report.id },
          },
          statusHistory: {
            create: {
              status: "BACKLOG",
              notes: `Task created from report #${report.id} with status BACKLOG`,
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
              notes: `Report escalated to task #${task.id} after being marked as TEMUAN`,
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
        keterangan: `Pelapor: ${report.pelapor}\n\nDeskripsi: ${report.description}`,

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
            notes: `Task created from report #${report.id} with status BACKLOG`,
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
            notes: `Report escalated to task #${task.id}`,
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
