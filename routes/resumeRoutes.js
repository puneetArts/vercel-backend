const express = require("express");
const router = express.Router();
const resumeUpload = require("../middlewares/resumeUpload");
const { uploadResume, getUserResumes, getCollegeResumes } = require("../controllers/resumeController");
const auth = require("../middleware/auth");

// Upload resume
router.post("/", auth, resumeUpload.single("resume"), uploadResume);

// Get user resumes
router.get("/user/:userId", auth, getUserResumes);

// Get college resumes
router.get("/college", auth, getCollegeResumes);

module.exports = router;
