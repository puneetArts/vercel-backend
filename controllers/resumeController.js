const Resume = require("../models/Resume");

// Upload a new resume
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const resume = new Resume({
      user: req.user._id,
      college: req.user.college,
      fileUrl: req.file.path, // Cloudinary URL
      fileName: req.file.originalname,
    });

    await resume.save();
    res.json({ msg: "Resume uploaded successfully", resume });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get resumes of a user
exports.getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.params.userId })
      .populate("user", "name profilePic")
      .sort({ createdAt: -1 });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get resumes from the same college
exports.getCollegeResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ college: req.user.college })
      .populate("user", "name profilePic")
      .sort({ createdAt: -1 });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
