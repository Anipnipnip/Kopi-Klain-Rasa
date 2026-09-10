const jwt = require("jsonwebtoken");

const authGuestUser = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    // Guest Mode
    req.user = null;
    return next();
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT);
    if (tokenDecode.id) {
      req.user = { id: tokenDecode.id };
    }
    next();
  } catch (err) {
    req.user = null; // tetap biarkan guest
    next();
  }
};

module.exports = authGuestUser;