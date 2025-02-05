/**
 * Success response handler
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {*} data - Response data
 */
const successResponse = (
  res,
  statusCode = 200,
  message = "Success",
  data = null
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Error response handler
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {*} errors - Error details
 */
const errorResponse = (
  res,
  statusCode = 500,
  message = "Internal Server Error",
  errors = null
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

/**
 * Not found response handler
 * @param {Object} res - Express response object
 * @param {string} message - Not found message
 */
const notFoundResponse = (res, message = "Resource not found") => {
  return errorResponse(res, 404, message);
};

/**
 * Validation error response handler
 * @param {Object} res - Express response object
 * @param {string} message - Validation error message
 * @param {*} errors - Validation error details
 */
const validationErrorResponse = (
  res,
  message = "Validation Error",
  errors = null
) => {
  return errorResponse(res, 400, message, errors);
};

module.exports = {
  successResponse,
  errorResponse,
  notFoundResponse,
  validationErrorResponse,
};
