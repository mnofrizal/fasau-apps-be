require("dotenv").config();

// Environment & URLs
const WA_URL = process.env.WA_URL || "http://localhost:3920/api";

// Endpoint Paths
const ENDPOINTS = {
  WA: {
    BASE: WA_URL,
    SEND_MESSAGE: `${WA_URL}/messages`,
    SEND_TEMPLATE: `${WA_URL}/messages/template`,
    GET_GROUPS: `${WA_URL}/groups`,
  },
};

module.exports = {
  WA_URL,
  ENDPOINTS,
};
