//backend/controllers/userController.js
const User = require("../models/User");

exports.getUsersFromSameCollege = async (req, res) => {
  const collegeId = req.user.college;
  const users = await User.find({ college: collegeId }).select('-password');
  res.json(users);
};

exports.getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password').populate('college');
  res.json(user);
};

// Send friend request
exports.sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId } = req.body;

    if (senderId.toString() === receiverId) {
      return res.status(400).json({ msg: "Cannot send friend request to yourself" });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({ msg: "User to add not found" });
    }

    if (sender.friends.includes(receiverId)) {
      return res.status(400).json({ msg: "Already friends" });
    }

    if (sender.friendRequestsSent.includes(receiverId)) {
      return res.status(400).json({ msg: "Friend request already sent" });
    }

    sender.friendRequestsSent.push(receiverId);
    receiver.friendRequestsReceived.push(senderId);

    await sender.save();
    await receiver.save();

    res.json({ msg: "Friend request sent" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Accept friend request
exports.acceptFriendRequest = async (req, res) => {
  try {
    const receiverId = req.user._id;
    const { senderId } = req.body;

    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    if (!sender) return res.status(404).json({ msg: "Sender user not found" });

    if (!receiver.friendRequestsReceived.includes(senderId)) {
      return res.status(400).json({ msg: "No friend request from this user" });
    }

    receiver.friends.push(senderId);
    sender.friends.push(receiverId);

    receiver.friendRequestsReceived = receiver.friendRequestsReceived.filter(id => id.toString() !== senderId);
    sender.friendRequestsSent = sender.friendRequestsSent.filter(id => id.toString() !== receiverId.toString());

    await receiver.save();
    await sender.save();

    res.json({ msg: "Friend request accepted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Decline friend request
exports.declineFriendRequest = async (req, res) => {
  try {
    const receiverId = req.user._id;
    const { senderId } = req.body;

    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    if (!sender) return res.status(404).json({ msg: "Sender user not found" });

    if (!receiver.friendRequestsReceived.includes(senderId)) {
      return res.status(400).json({ msg: "No friend request from this user" });
    }

    receiver.friendRequestsReceived = receiver.friendRequestsReceived.filter(id => id.toString() !== senderId);
    sender.friendRequestsSent = sender.friendRequestsSent.filter(id => id.toString() !== receiverId.toString());

    await receiver.save();
    await sender.save();

    res.json({ msg: "Friend request declined" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get friend requests
exports.getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("friendRequestsReceived", "name email");
    res.json(user.friendRequestsReceived);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get friends list
exports.getFriendsList = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("friends", "name email profilePic");
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// View other user's profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .select('-password')
      .populate('college', 'name')
      .populate('friends', 'name email');

    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ UPDATED: updateUserProfile with file upload support
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, bio, major, year, interests } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (major !== undefined) user.major = major;
    if (year !== undefined) user.year = year;

    if (interests !== undefined) {
      user.interests = Array.isArray(interests)
        ? interests
        : interests.split(',').map(i => i.trim()).filter(i => i);
    }

    // ✅ Cloudinary file URL directly from multer
    if (req.file) {
      user.profilePic = req.file.path;
    } else if (req.body.profilePic) {
      user.profilePic = req.body.profilePic;
    }

    await user.save();
    res.json({ msg: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
