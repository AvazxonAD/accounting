const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  console.log('---------------- GLOBAL ERROR HANDLER ----------------'.red);
  console.log(err.stack.red);

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "internal server error",
  });
};

module.exports = errorHandler;
