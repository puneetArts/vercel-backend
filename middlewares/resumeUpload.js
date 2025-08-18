const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary"); // uses your cloudinary.js

// Cloudinary storage for resumes
const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "resumes", // all resumes go here
    resource_type: "raw", // ✅ important for non-image files
    allowed_formats: ["pdf", "doc", "docx"],
  },
});

const resumeUpload = multer({ storage: resumeStorage });

module.exports = resumeUpload;
