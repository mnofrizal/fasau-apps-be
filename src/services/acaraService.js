const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const acaraService = {
  /**
   * Get all acara
   * @returns {Promise<Array>} Array of acara
   */
  getAllAcara: async () => {
    return await prisma.acara.findMany({
      orderBy: {
        dateTime: "asc",
      },
    });
  },

  /**
   * Get acara by ID
   * @param {number} id - Acara ID
   * @returns {Promise<Object>} Acara object
   */
  getAcaraById: async (id) => {
    return await prisma.acara.findUnique({
      where: { id },
    });
  },

  /**
   * Create new acara
   * @param {Object} acaraData - Acara data
   * @returns {Promise<Object>} Created acara object
   */
  createAcara: async (acaraData) => {
    return await prisma.acara.create({
      data: acaraData,
    });
  },

  /**
   * Update acara
   * @param {number} id - Acara ID
   * @param {Object} acaraData - Updated acara data
   * @returns {Promise<Object>} Updated acara object
   */
  updateAcara: async (id, acaraData) => {
    return await prisma.acara.update({
      where: { id },
      data: acaraData,
    });
  },

  /**
   * Delete acara
   * @param {number} id - Acara ID
   * @returns {Promise<Object>} Deleted acara object
   */
  deleteAcara: async (id) => {
    return await prisma.acara.delete({
      where: { id },
    });
  },

  /**
   * Get acara by status
   * @param {string} status - Acara status
   * @returns {Promise<Array>} Array of acara
   */
  getAcaraByStatus: async (status) => {
    return await prisma.acara.findMany({
      where: { status },
      orderBy: {
        dateTime: "asc",
      },
    });
  },

  /**
   * Get upcoming acara (next 7 days)
   * @returns {Promise<Array>} Array of upcoming acara
   */
  getUpcomingAcara: async () => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return await prisma.acara.findMany({
      where: {
        AND: [
          { dateTime: { gte: now } },
          { dateTime: { lte: nextWeek } },
          { status: "UPCOMING" },
        ],
      },
      orderBy: {
        dateTime: "asc",
      },
    });
  },

  /**
   * Get acara by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Array>} Array of acara within date range
   */
  getAcaraByDateRange: async (startDate, endDate) => {
    return await prisma.acara.findMany({
      where: {
        dateTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        dateTime: "asc",
      },
    });
  },

  /**
   * Get acara by category
   * @param {string} category - Acara category
   * @returns {Promise<Array>} Array of acara
   */
  getAcaraByCategory: async (category) => {
    return await prisma.acara.findMany({
      where: { category },
      orderBy: {
        dateTime: "asc",
      },
    });
  },
};

module.exports = acaraService;
