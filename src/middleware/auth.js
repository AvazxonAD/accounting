const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/asyncHandler.js");
const ErrorResponse = require("../utils/errorResponse.js");
const pool = require("../config/db.js");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse("Token notog'ri jonatildi", 403));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded) {
    return next(new ErrorResponse("Siz tizimga kirmagansiz", 403));
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);
  if (decoded.exp && decoded.exp < currentTimestamp) {
    return next(new ErrorResponse("Token muddati tugagan", 403));
  }

  let user = await pool.query(
    `SELECT id, role_id, region_id FROM users WHERE id = $1`,
    [decoded.id],
  );
  user = user.rows[0];
  if (!user) {
    return next(new ErrorResponse("User topilmadi", 404));
  }
  req.user = user;
  next();
});
