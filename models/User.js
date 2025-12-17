//backend/models/User.js
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  college: { type: mongoose.Schema.Types.ObjectId, ref: "College" },

  isEmailVerified: { type: Boolean, default: false },
  
  // New profile fields
  profilePic: { type: String, default: '' }, // URL or filename
  bio: { type: String, default: '' },
  major: { type: String, default: '' },
  year: { type: String, default: '' },
  interests: { type: [String], default: [] },
  link: { type: String, default: '' },
  web: { type: String, default: '' },
  

  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],            // confirmed friends
  friendRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // requests user sent
  friendRequestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  

});


module.exports = mongoose.model("User", userSchema);