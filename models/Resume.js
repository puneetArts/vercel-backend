const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    college: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },
    resumeUrl: { type: String, required: true }, // Cloudinary URL
    originalName: { type: String }, // store original file name (optional)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
