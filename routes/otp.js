//backend/routes/otp.js
const router = require("express").Router();
const {
  verifyEmailOTP,
  forgotPassword,
  resetPassword
} = require("../controllers/otpController");

router.post("/verify-email", verifyEmailOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
