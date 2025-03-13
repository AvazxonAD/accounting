"use strict";

var errorCatch = function errorCatch(error, res) {
  console.log(error.stack.red);
  return res.status((error === null || error === void 0 ? void 0 : error.statusCode) || 500).send({
    error: error.message || "internal server error"
  });
};
module.exports = {
  errorCatch: errorCatch
};