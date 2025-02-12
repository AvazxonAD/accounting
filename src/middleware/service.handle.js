const ErrorResponse = require("@utils/errorResponse");

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
