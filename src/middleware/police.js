const ErrorResponse = require('../utils/errorResponse')
const police = (accessKey) => {
  try {
    return (req, res, next) => {
      const userAccess = req.user.access_object;
      if (!userAccess[accessKey]) {
        throw new ErrorResponse('Access denied: You do not have permission to perform this action', 403)
      }
      next();
    };
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
};

module.exports = { police }