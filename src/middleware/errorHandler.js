const errorHandler = (err, req, res, next) => {
  console.error("---------------- GLOBAL ERROR HANDLER ----------------".red);
  console.error(err.stack.red);

  const message = req.i18n.t(`${err.message}`) || "Internal Server Error";
  const code = err.statusCode || 500;

  res.error(message, code);
};

module.exports = errorHandler;
