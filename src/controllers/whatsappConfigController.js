const whatsappService = require("../services/whatsappConfigService");

// Get current WhatsApp configuration
const get = async (req, res) => {
  try {
    const config = await whatsappService.getConfig();

    if (!config) {
      return res.status(404).json({
        status: "fail",
        message: "WhatsApp configuration not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "WhatsApp configuration retrieved successfully",
      data: config,
    });
  } catch (error) {
    console.error("Error getting WhatsApp config:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to get WhatsApp configuration",
    });
  }
};

// Create or update WhatsApp configuration
const create = async (req, res) => {
  try {
    const { groupId, groupName } = req.body;

    if (!groupId || !groupName) {
      return res.status(400).json({
        status: "fail",
        message: "Group ID and name are required",
      });
    }

    const config = await whatsappService.upsertConfig({
      groupId,
      groupName,
    });

    res.status(201).json({
      status: "success",
      message: "WhatsApp configuration created/updated successfully",
      data: config,
    });
  } catch (error) {
    console.error("Error creating/updating WhatsApp config:", error);
    if (error.code === "P2002") {
      return res.status(409).json({
        status: "fail",
        message: "Group ID must be unique",
      });
    }
    res.status(500).json({
      status: "error",
      message: "Failed to create/update WhatsApp configuration",
    });
  }
};

// Delete WhatsApp configuration
const remove = async (req, res) => {
  try {
    const config = await whatsappService.deleteConfig();

    if (!config) {
      return res.status(404).json({
        status: "fail",
        message: "WhatsApp configuration not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "WhatsApp configuration deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting WhatsApp config:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete WhatsApp configuration",
    });
  }
};

module.exports = {
  get,
  create,
  remove,
};
