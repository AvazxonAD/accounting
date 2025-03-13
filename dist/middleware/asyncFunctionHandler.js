"use strict";

var handleServiceError = function handleServiceError(fn) {
  return function () {
    return Promise.resolve(fn.apply(void 0, arguments))["catch"](function (error) {
      throw new Error(error);
    });
  };
};
module.exports = handleServiceError;