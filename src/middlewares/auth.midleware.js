const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ status: "fail", message: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: "fail",
        message: "Access token is invalid or expired",
      });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
