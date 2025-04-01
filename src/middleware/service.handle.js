const ErrorResponse = require("@helper/error.response");

const handleServiceError =
  (fn) =>
  async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      throw new ErrorResponse(error.message, error?.statusCode);
    }
  };

module.exports = {
  handleServiceError,
};
