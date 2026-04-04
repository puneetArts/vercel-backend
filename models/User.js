const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  college: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },

  isEmailVerified: { type: Boolean, default: false },

  profilePic: { type: String, default: '' },
  bio: { type: String, default: '' },
  major: { type: String, default: '' },
  year: { type: String, default: '' },
  interests: { type: [String], default: [] },
  link: { type: String, default: '' },
  web: { type: String, default: '' },

  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  joinedClubs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Club' }],

  role: {
    type: String,
    enum: ['student', 'ambassador'],
    default: 'student',
  },
});

module.exports = mongoose.model('User', userSchema);
