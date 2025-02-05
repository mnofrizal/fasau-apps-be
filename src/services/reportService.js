const { PrismaClient } = require("@prisma/client");
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
    return await prisma.taskReport.create({
      data: reportData,
    });
  },

  /**
   * Update report
   * @param {number} id - Report ID
   * @param {Object} reportData - Updated report data
   * @returns {Promise<Object>} Updated report object
   */
  updateReport: async (id, reportData) => {
    return await prisma.taskReport.update({
      where: { id },
      data: reportData,
    });
  },

  /**
   * Delete report
   * @param {number} id - Report ID
   * @returns {Promise<Object>} Deleted report object
   */
  deleteReport: async (id) => {
    return await prisma.taskReport.delete({
      where: { id },
    });
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
};

module.exports = reportService;
