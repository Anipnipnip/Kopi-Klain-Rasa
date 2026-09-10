const User = require("../models/user");

const updateCart = async (req, res) => {
  try {
    const { cartItems } = req.body;

    if (!cartItems || typeof cartItems !== "object") {
      return res.json({ success: false, message: "Invalid cart data" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,   // ✅ langsung dari req.user
      { cartItems },
      { new: true }
    );

    if (!updatedUser) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Cart updated successfully",
      cartItems: updatedUser.cartItems,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports = updateCart;