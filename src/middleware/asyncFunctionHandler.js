const handleServiceError = (fn) => {
  return (...args) => {
    return Promise.resolve(fn(...args)).catch((error) => {
      throw new Error(error);
    });
  };
};

module.exports = handleServiceError;
