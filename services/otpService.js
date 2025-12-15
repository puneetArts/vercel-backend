//backend/services/otpService.js

const crypto = require("crypto");
const OTP = require("../models/OTP");

exports.generateOTP = async (userId, purpose) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  await OTP.deleteMany({ userId, purpose });

  await OTP.create({
    userId,
    otpHash,
    purpose,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000)
  });

  return otp;
};

exports.verifyOTP = async (userId, otp, purpose) => {
  const record = await OTP.findOne({ userId, purpose });
  if (!record) return false;

  if (record.expiresAt < Date.now()) return false;
  if (record.attempts >= 5) return false;

  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  record.attempts += 1;
  await record.save();

  if (otpHash !== record.otpHash) return false;

  await OTP.deleteOne({ _id: record._id });
  return true;
};
