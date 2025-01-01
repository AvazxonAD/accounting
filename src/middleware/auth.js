const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.error("Token noto'g'ri yuborildi", 403);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.error("Siz tizimga kirmagansiz", 403);
    }
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTimestamp) {
      return res.error("Token muddati tugagan", 403);
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.error(403, error.message);
  }
};
