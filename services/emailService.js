// backend/services/emailService.js
const axios = require("axios");

const sendEmail = async ({ to, subject, html }) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: process.env.SENDER_EMAIL,
          name: "LynxApp"
        },
        to: [{ email: to }],
        subject,
        htmlContent: html
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ EMAIL SENT VIA BREVO API");
  } catch (err) {
    console.error(
      "❌ BREVO API EMAIL ERROR:",
      err.response?.data || err.message
    );
    throw err;
  }
};

module.exports = { sendEmail };
