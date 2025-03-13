"use strict";

module.exports = function (req, res, next) {
  res.error = function (message, statusCode, meta, data) {
    return res.status(statusCode).json({
      code: statusCode || 500,
      message: message || "Interval server error",
      meta: meta ? meta : null,
      data: data ? data : null,
      success: false,
      time: new Date().toISOString()
    });
  };
  res.success = function (message, statusCode, meta, data) {
    return res.status(statusCode).json({
      code: statusCode || 500,
      message: message || "Interval server error",
      meta: meta ? meta : null,
      data: data ? data : null,
      success: true,
      time: new Date().toISOString()
    });
  };
  next();
};