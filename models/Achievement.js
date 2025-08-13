const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  college: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date },
  certificate: { type: String }, // Path/URL to certificate image or file
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema);
