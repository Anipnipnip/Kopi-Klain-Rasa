const jwt = require('jsonwebtoken');

const authUser = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({ success: false, message: 'Not Authorized, no token' });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT);
    if (tokenDecode.id) {
      req.user = { id: tokenDecode.id }; // ✅ simpan ke req.user
      next();
    } else {
      return res.json({ success: false, message: 'Not Authorized' });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports = authUser;