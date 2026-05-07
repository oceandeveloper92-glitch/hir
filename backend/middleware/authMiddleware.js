const jwt = require("jsonwebtoken");

const authenticated = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(909).json({
      status: "error",
      error: "NoTokenProvided",
      message: "Access denied. No token provided.",
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, "123456789_apple_banana");

    req.user = decoded;

    next();
  } catch (error) {
    

    // Check for token expiration specifically
    if (error.name === "TokenExpiredError") {
      return res.status(909).json({
        status: "error",
        error: "tokenExpired",
        message: "The token has expired.",
      });
    }

    // For all other errors (invalid token)
    return res.status(909).json({
      status: "error",
      error: "tokenNotValid",
      message: "The token is not valid.",
    });
  }
};

module.exports = { authenticated };
