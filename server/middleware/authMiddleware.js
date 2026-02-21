const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

exports.verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const blacklistCheck = await pool.query(
      "SELECT 1 FROM blacklisted_tokens WHERE token = $1",
      [token],
    );

    if (blacklistCheck.rowCount > 0) {
      return res
        .status(403)
        .json({ message: "Token is invalidated (Logged out)" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

exports.authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
