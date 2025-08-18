const express = require("express");
const router = express.Router();
const resumeUpload = require("../middlewares/resumeUpload");
const { uploadResume, getUserResume, getCollegeResumes } = require("../controllers/resumeController");
const auth = require('../middlewares/authMiddleware');

// Upload resume
router.post("/", auth, resumeUpload.single("resume"), uploadResume);

// Get user resumes
router.get("/user/:userId", auth, getUserResume);

// Get college resumes
router.get("/college", auth, getCollegeResumes);

module.exports = router;
