const axios = require("axios");
const { ENDPOINTS } = require("../config/constants");

// Send a message to a specified number
const sendMessage = async (phoneNumber, message) => {
  try {
    const response = await axios.post(ENDPOINTS.WA.SEND_MESSAGE, {
      phoneNumber,
      message,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error.message);
    throw new Error("Failed to send WhatsApp message");
  }
};

// Send a template message to a group
const sendTemplateMessage = async (templateName, data, groupId) => {
  try {
    const response = await axios.post(ENDPOINTS.WA.SEND_TEMPLATE, {
      templateName,
      data,
      groupId,
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending template message:", error.message);
    throw new Error("Failed to send template message");
  }
};

const sendUpdateTemplateMessage = async (
  messageId,
  templateName,
  data,
  groupId
) => {
  try {
    const response = await axios.put(
      `${ENDPOINTS.WA.SEND_MESSAGE}/${messageId}/template`,
      {
        templateName,
        data,
        groupId,
      }
    );
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending template message:", error.message);
    throw new Error("Failed to send template message");
  }
};

const deleteMessage = async (messageId) => {
  try {
    const response = await axios.delete(
      `${ENDPOINTS.WA.SEND_MESSAGE}/${messageId}`
    );
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting message:", error.message);
    throw new Error("Failed to delete message");
  }
};

// Get all WhatsApp groups
const getAllGroups = async () => {
  try {
    const response = await axios.get(ENDPOINTS.WA.GET_GROUPS);
    return response.data;
  } catch (error) {
    console.error("Error getting WhatsApp groups:", error.message);
    throw new Error("Failed to get WhatsApp groups");
  }
};

module.exports = {
  sendMessage,
  sendTemplateMessage,
  sendUpdateTemplateMessage,
  getAllGroups,
  deleteMessage,
};
