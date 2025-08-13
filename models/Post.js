const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  college: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
  content: { type: String, required: true },
  image: { type: String }, // Optional post image
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
