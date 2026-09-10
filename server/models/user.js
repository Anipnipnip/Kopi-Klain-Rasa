const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  cartITems: {
    type: Object,
    default: {}
  },

  // Reset PW
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  // Email verification
  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpire: Date,

}, { minimize: false, timestamps: true });

const User = mongoose.models.user || mongoose.model('user', userSchema);

module.exports = User;