const { PrismaClient } = require("@prisma/client");
const socketUtils = require("../utils/socket");
const PDFDocument = require("pdfkit");
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
    const { type, reference, notes, createdBy, to, items } = movementData;

    return await prisma.$transaction(async (tx) => {
      // Create the transaction record
      const transaction = await tx.inventoryTransaction.create({
        data: {
          type,
          reference,
          notes,
          createdBy,
          status: type === "IN" ? "RECEIVED" : "DELIVERING",
          to: type === "OUT" ? to : null,
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
              location: item.location || "Gudang Eks Golf",
              ...(item.unit && { unit: item.unit }), // Only include unit if provided
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

  /**
   * Get transaction by reference number
   * @param {string} reference - Transaction reference number
   * @returns {Promise<Object>} Transaction details with items
   */
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

  /**
   * Get inventory items by name (case insensitive)
   * @param {string} name - Item name to search for
   * @returns {Promise<Array>} Array of matching inventory items
   */
  getItemsByName: async (name) => {
    return await prisma.inventoryItem.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      orderBy: {
        name: "asc",
      },
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
          take: 5, // Include last 5 transactions
        },
      },
    });
  },

  /**
   * Create a new inventory item
   * @param {Object} data - Item data including name, category, and location
   * @returns {Promise<Object>} Created item
   * @throws {Error} If item with same name already exists
   */
  createItem: async (data) => {
    // Check for existing item with same name
    const existingItem = await prisma.inventoryItem.findFirst({
      where: {
        name: data.name,
      },
    });

    if (existingItem) {
      throw new Error(`Item with name "${data.name}" already exists`);
    }

    return await prisma.inventoryItem.create({
      data: {
        name: data.name,
        category: data.category || "OTHER",
        quantity: data.quantity || 0,
        location: data.location || "Gudang Eks Golf",
        ...(data.unit && { unit: data.unit }), // Only include unit if provided
      },
    });
  },

  /**
   * Update inventory item
   * @param {number} id - Item ID
   * @param {Object} data - Updated item data
   * @returns {Promise<Object>} Updated item
   */
  updateItem: async (id, data) => {
    return await prisma.inventoryItem.update({
      where: { id },
      data: {
        name: data.name,
        category: data.category,
        location: data.location,
        ...(data.unit && { unit: data.unit }), // Only include unit if provided
      },
    });
  },

  /**
   * Delete inventory item
   * @param {number} id - Item ID
   * @returns {Promise<Object>} Deleted item
   */
  deleteItem: async (id) => {
    // Check if item has any transactions
    const itemWithTransactions = await prisma.inventoryItem.findUnique({
      where: { id },
      include: {
        transactionItems: true,
      },
    });

    if (itemWithTransactions?.transactionItems.length > 0) {
      throw new Error("Cannot delete item with existing transactions");
    }

    return await prisma.inventoryItem.delete({
      where: { id },
    });
  },

  /**
   * Update transaction
   * @param {number} id - Transaction ID
   * @param {Object} data - Updated transaction data
   * @returns {Promise<Object>} Updated transaction
   */
  updateTransaction: async (id, data) => {
    // Get current transaction to verify status update
    const currentTransaction = await prisma.inventoryTransaction.findUnique({
      where: { id },
    });

    if (!currentTransaction) {
      throw new Error("Transaction not found");
    }

    // Validate status transitions
    if (data.status) {
      const validTransitions = {
        DELIVERING: ["DELIVERED"],
        DELIVERED: [],
        RECEIVED: [],
      };

      const currentStatus = currentTransaction.status;
      if (!validTransitions[currentStatus]?.includes(data.status)) {
        throw new Error(
          `Invalid status transition from ${currentStatus} to ${data.status}`
        );
      }
    }

    return await prisma.inventoryTransaction.update({
      where: { id },
      data: {
        reference: data.reference,
        notes: data.notes,
        ...(data.status && { status: data.status }),
        ...(data.to && { to: data.to }),
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
   * Delete transaction
   * @param {number} id - Transaction ID
   * @returns {Promise<Object>} Deleted transaction
   */
  deleteTransaction: async (id) => {
    return await prisma.$transaction(async (tx) => {
      // Get the transaction with items
      const transaction = await tx.inventoryTransaction.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              item: true,
            },
          },
        },
      });

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      // Reverse the quantity changes
      for (const transactionItem of transaction.items) {
        const quantityChange =
          transaction.type === "IN"
            ? -transactionItem.quantity // If it was IN, subtract
            : transactionItem.quantity; // If it was OUT, add back

        await tx.inventoryItem.update({
          where: { id: transactionItem.item.id },
          data: {
            quantity: {
              increment: quantityChange,
            },
          },
        });
      }

      // Delete the transaction (cascade will handle transactionItems)
      return await tx.inventoryTransaction.delete({
        where: { id },
      });
    });
  },
};

module.exports = inventoryService;
