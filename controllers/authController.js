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
      isEmailVerified: false,
    });

    const otp = await generateOTP(user._id, "EMAIL_VERIFY");

    await sendEmail({
      to: email,
      subject: "Verify your LynxApp account",
      html: `
  <div style="font-family: Arial, sans-serif; background-color: #292c2fff; padding: 30px;">
    <div style="max-width: 500px; margin: auto; background: #0f172a; padding: 25px; border-radius: 8px;">
      
      <h2 style="color: #205d9aff; text-align: center;">
        Welcome to LynxApp
      </h2>

      <p style="font-size: 15px; color: #e5e7eb;">
        We're excited to have you on <b>LynxApp</b> — a platform built to help students connect, collaborate, and grow together.
      </p>

      <p style="font-size: 15px; color: #e5e7eb">
        To continue, please verify your email using the One-Time Password (OTP) below:
      </p>

      <div style="text-align: center; margin: 25px 0;">
        <span style="
          font-size: 28px;
          letter-spacing: 4px;
          font-weight: bold;
          color: #1d5893ff;
          background: #252729ff;
          padding: 12px 20px;
          border-radius: 6px;
          
          display: inline-block;
        ">
          ${otp}
        </span>
      </div>

      <p style="font-size: 14px; color:  #cbd5f5;">
        This OTP is valid for <b>10 minutes ⏱️</b>. Please do not share it with anyone.
      </p>

      <p style="font-size: 14px; color:  #9ca3af;">
        If you did not create this account, you can safely ignore this email.
      </p>

      <hr style="margin: 10px 0; border: none; border-top: 1px solid #1f2937;" />

      <p style="font-size: 13px; color: #6b7280; text-align: center;">
        © ${new Date().getFullYear()} LynxApp · Connect. Collaborate. Grow.
      </p>

    </div>
  </div>
`,
    });

    res.status(201).json({
      msg: "Signup successful. Please verify your email.",
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
    expiresIn: "12h",
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
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (major !== undefined) user.major = major;
    if (year !== undefined) user.year = year;
    if (interests !== undefined) user.interests = interests;

    // File handling with Cloudinary
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_pics", // optional: stores in folder
      });
      user.profilePic = uploadResult.secure_url;
    }

    await user.save();
    res.json({ msg: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
