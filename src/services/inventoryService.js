const { PrismaClient } = require("@prisma/client");
const socketUtils = require("../utils/socket");
const prisma = new PrismaClient();

const inventoryService = {
  /**
   * Get all inventory items
   * @returns {Promise<Array>} Array of inventory items with their current quantities and locations
   */
  getAllItems: async () => {
    return await prisma.inventoryItem.findMany({
      orderBy: {
        name: "asc",
      },
    });
  },

  /**
   * Get item by ID with transaction history
   * @param {number} id - Item ID
   * @returns {Promise<Object>} Item details with transaction history
   */
  getItemById: async (id) => {
    return await prisma.inventoryItem.findUnique({
      where: { id },
      include: {
        transactionItems: {
          include: {
            transaction: true,
          },
          orderBy: {
            transaction: {
              createdAt: "desc",
            },
          },
        },
      },
    });
  },

  /**
   * Record batch movement (IN/OUT) of items
   * @param {Object} movementData - Movement data including type, reference, items, etc.
   * @returns {Promise<Object>} Created transaction with items
   */
  recordBatchMovement: async (movementData) => {
    const { type, reference, notes, createdBy, items } = movementData;

    return await prisma.$transaction(async (tx) => {
      // Create the transaction record
      const transaction = await tx.inventoryTransaction.create({
        data: {
          type,
          reference,
          notes,
          createdBy,
        },
      });

      // Process each item in the transaction
      for (const item of items) {
        // Find or create the inventory item based on name and category
        let inventoryItem = await tx.inventoryItem.findFirst({
          where: {
            name: item.name,
            category: item.category || "OTHER",
          },
        });

        if (!inventoryItem) {
          inventoryItem = await tx.inventoryItem.create({
            data: {
              name: item.name,
              category: item.category || "OTHER",
              quantity: 0,
              location: item.location,
            },
          });
        }

        // Calculate new quantity
        const quantityChange = type === "IN" ? item.quantity : -item.quantity;
        const newQuantity = inventoryItem.quantity + quantityChange;

        // Prevent negative stock
        if (newQuantity < 0) {
          throw new Error(
            `Not enough stock for item: ${item.name}. Current stock: ${inventoryItem.quantity}`
          );
        }

        // Update inventory item quantity and location if provided
        await tx.inventoryItem.update({
          where: { id: inventoryItem.id },
          data: {
            quantity: newQuantity,
            ...(item.location && { location: item.location }),
          },
        });

        // Create transaction item record
        await tx.transactionItem.create({
          data: {
            quantity: item.quantity,
            notes: item.notes,
            transaction: { connect: { id: transaction.id } },
            item: { connect: { id: inventoryItem.id } },
          },
        });
      }

      // Get the complete transaction with all items
      const completeTransaction = await tx.inventoryTransaction.findUnique({
        where: { id: transaction.id },
        include: {
          items: {
            include: {
              item: true,
            },
          },
        },
      });

      return completeTransaction;
    });
  },

  /**
   * Get all transactions
   * @returns {Promise<Array>} Array of transactions with their items
   */
  getAllTransactions: async () => {
    return await prisma.inventoryTransaction.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });
  },

  /**
   * Get transaction by ID
   * @param {number} id - Transaction ID
   * @returns {Promise<Object>} Transaction details with items
   */
  getTransactionById: async (id) => {
    return await prisma.inventoryTransaction.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });
  },

  /**
   * Get transaction by reference number
   * @param {string} reference - Transaction reference number
   * @returns {Promise<Object>} Transaction details with items
   */
  /**
   * Get items by category
   * @param {string} category - Category name
   * @returns {Promise<Array>} Array of items in the specified category
   */
  getItemsByCategory: async (category) => {
    return await prisma.inventoryItem.findMany({
      where: { category },
      orderBy: {
        name: "asc",
      },
    });
  },

  getTransactionByReference: async (reference) => {
    return await prisma.inventoryTransaction.findFirst({
      where: { reference },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });
  },
};

module.exports = inventoryService;
