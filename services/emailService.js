// backend/services/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // must be false for 587
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS
  }
});

// optional: verify SMTP connection at startup
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ Brevo SMTP ERROR:", err.message);
  } else {
    console.log("✅ Brevo SMTP Ready");
  }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "LynxApp <no-reply@lynxapp.com>",
      to,
      subject,
      html
    });
  } catch (err) {
    console.error("❌ EMAIL SEND FAILED:", err.message);
    throw err; // keeps correct 500 handling
  }
};

module.exports = { sendEmail };
