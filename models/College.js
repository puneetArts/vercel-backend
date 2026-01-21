//backend/models/College.js
const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  domain: {
    type: String
  }
});

module.exports = mongoose.model("College", collegeSchema);
