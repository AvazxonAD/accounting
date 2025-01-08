const errorHandler = (err, req, res, next) => {
  console.error('---------------- GLOBAL ERROR HANDLER ----------------'.red);
  console.error(err.stack.red);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;