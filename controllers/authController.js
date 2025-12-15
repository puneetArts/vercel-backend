//backend/controllers/authController
const User = require("../models/User");
const College = require("../models/College");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { generateOTP } = require("../services/otpService");

const { sendEmail } = require("../services/emailService");



// exports.signup = async (req, res) => {
//   try {
//     const { name, email, password, collegeId } = req.body;
//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ msg: "User already exists" });
//     const hash = await bcrypt.hash(password, 10);
//     user = new User({ name, email, password: hash, college: collegeId });
//     await user.save();
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "12h" });
//     res.status(201).json({ token });
//   } catch (e) {
//     res.status(500).json({ msg: e.message });
//   }
// };
exports.signup = async (req, res) => {
  try {
    const { name, email, password, collegeId } = req.body;

    if (await User.findOne({ email }))
      return res.status(400).json({ msg: "User already exists" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      college: collegeId,
      isEmailVerified: false
    });

    const otp = await generateOTP(user._id, "EMAIL_VERIFY");

    await sendEmail({
      to: email,
      subject: "Verify your LynxApp account",
      html: `
        <h3>Your OTP is <b>${otp}</b></h3>
        <p>This OTP is valid for 10 minutes.</p>
      `
    });

    res.status(201).json({
      msg: "Signup successful. Please verify your email."
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email }).populate("college");
//     if (!user) return res.status(400).json({ msg: "Invalid credentials" });
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "12h" });
//     res.json({ token });
//   } catch (e) {
//     res.status(500).json({ msg: e.message });
//   }
// };
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).populate("college");
  if (!user) return res.status(400).json({ msg: "Invalid credentials" });

  if (!user.isEmailVerified)
    return res.status(403).json({ msg: "Email not verified" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "12h"
  });

  res.json({ token });
};

// exports.updateUserProfile = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     // If using Multer, access file: req.file
//     const { name, bio, major, year, interests } = req.body;

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ msg: 'User not found' });

//     if (name !== undefined) user.name = name;
//     if (bio !== undefined) user.bio = bio;
//     if (major !== undefined) user.major = major;
//     if (year !== undefined) user.year = year;
//     if (interests !== undefined) user.interests = interests;
//     // File handling
//     if (req.file) {
//       user.profilePic = `/uploads/${req.file.filename}`;
//     }

//     await user.save();
//     res.json({ msg: 'Profile updated', user });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

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
    if (interests !== undefined) user.interests = interests;

    // File handling with Cloudinary
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_pics" // optional: stores in folder
      });
      user.profilePic = uploadResult.secure_url;
    }

    await user.save();
    res.json({ msg: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
