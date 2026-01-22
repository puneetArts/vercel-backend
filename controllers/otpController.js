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
    html: `
  <div style="font-family: Arial, sans-serif; background-color: #292c2fff; padding: 30px;">
    <div style="max-width: 500px; margin: auto; background: #0f172a; padding: 25px; border-radius: 8px;">
      <h2 style={{ color: "rgb(247, 247, 247)", textAlign: "center" }}>
  Lynx <span style={{ color: "#F79B72" }}>App</span>
</h2>
      
      <h2 style="color: #205d9aff; text-align: center;">Reset Password</h2>

      <p style="font-size: 15px; color: #e5e7eb;">
        We received a request to reset your password for your <b>LynxApp</b> account.
      </p>

      <p style="font-size: 15px; color: #e5e7eb;">
        Use the following One-Time Password (OTP) to reset your password:
      </p>

      <div style="text-align: center; margin: 25px 0;">
        <span style="
          font-size: 28px;
          letter-spacing: 4px;
          font-weight: bold;
          color: #1d5893ff;
          background: #252729ff;
          padding: 12px 20px;
          border-radius: 6px;
          display: inline-block;
        ">
          ${otp}
        </span>
      </div>

      <p style="font-size: 14px; color: #cbd5f5;">
        This OTP is valid for <b>10 minutes ⏱️</b>. Please do not share it with anyone.
      </p>

      <p style="font-size: 14px; color: #9ca3af;">
        If you did not request a password reset, you can safely ignore this email.
      </p>

      <hr style="margin: 10px 0; border: none; border-top: 1px solid #1f2937;" />

      <p style="font-size: 13px; color: #6b7280; text-align: center;">
        © ${new Date().getFullYear()} LynxApp · Connect. Collaborate. Grow.
      </p>

    </div>
  </div>
`

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
