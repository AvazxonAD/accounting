"use strict";

var ErrorResponse = require('@utils/errorResponse');
var police = function police(accessKey) {
  try {
    return function (req, res, next) {
      var userAccess = req.user.access_object;
      if (!userAccess[accessKey]) {
        throw new ErrorResponse('Access denied: You do not have permission to perform this action', 403);
      }
      next();
    };
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode);
  }
};
module.exports = {
  police: police
};