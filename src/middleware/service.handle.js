const handleServiceError =
  (fn) =>
  async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      throw new Error(`Service error: ${error.message}`);
    }
  };

module.exports = {
  handleServiceError,
};
