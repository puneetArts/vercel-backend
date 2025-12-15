//backend/controllers/otpController.js
const User = require("../models/User");
const { verifyOTP, generateOTP } = require("../services/otpService");
const { sendEmail } = require("../services/emailService");
const bcrypt = require("bcryptjs");

exports.verifyEmailOTP = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ msg: "User not found" });

  const valid = await verifyOTP(user._id, otp, "EMAIL_VERIFY");
  if (!valid) return res.status(400).json({ msg: "Invalid or expired OTP" });

  user.isEmailVerified = true;
  await user.save();

  res.json({ msg: "Email verified successfully" });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ msg: "If email exists, OTP sent" });

  const otp = await generateOTP(user._id, "RESET_PASSWORD");

  await sendEmail({
    to: email,
    subject: "Reset your LynxApp password",
    html: `<h3>OTP: ${otp}</h3>`
  });

  res.json({ msg: "OTP sent to email" });
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });

  const valid = await verifyOTP(user._id, otp, "RESET_PASSWORD");
  if (!valid) return res.status(400).json({ msg: "Invalid or expired OTP" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ msg: "Password reset successful" });
};
