const { PrismaClient } = require("@prisma/client");
const socketUtils = require("../utils/socket");
const prisma = new PrismaClient();

const reportService = {
  /**
   * Get all reports
   * @returns {Promise<Array>} Array of reports
   */
  getAllReports: async () => {
    return await prisma.taskReport.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  /**
   * Get report by ID
   * @param {number} id - Report ID
   * @returns {Promise<Object>} Report object
   */
  getReportById: async (id) => {
    return await prisma.taskReport.findUnique({
      where: { id },
    });
  },

  /**
   * Create new report
   * @param {Object} reportData - Report data
   * @returns {Promise<Object>} Created report object
   */
  createReport: async (reportData) => {
    const report = await prisma.taskReport.create({
      data: reportData,
    });
    socketUtils.getIO().emit("report_created"); // Emit event to refresh reports
    return report;
  },

  /**
   * Update report
   * @param {number} id - Report ID
   * @param {Object} reportData - Updated report data
   * @returns {Promise<Object>} Updated report object
   */
  updateReport: async (id, reportData) => {
    const report = await prisma.taskReport.update({
      where: { id },
      data: reportData,
    });
    socketUtils.getIO().emit("report_created"); // Emit event to refresh reports after update
    return report;
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
   * @returns {Promise<Array>} Array of reports
   */
  getReportsByCategory: async (category) => {
    return await prisma.taskReport.findMany({
      where: { category },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  /**
   * Get reports by pelapor
   * @param {string} pelapor - Reporter name
   * @returns {Promise<Array>} Array of reports
   */
  getReportsByPelapor: async (pelapor) => {
    return await prisma.taskReport.findMany({
      where: { pelapor },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  /**
   * Search reports
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of matching reports
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
    });
  },

  /**
   * Get today's reports
   * @returns {Promise<Array>} Array of today's reports
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
    });
  },
};

module.exports = reportService;
