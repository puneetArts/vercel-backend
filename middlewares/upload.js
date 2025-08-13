const multer = require("multer");
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary'); // Your cloudinary v2 config instance

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'upload-folder', // specify your Cloudinary folder here
    allowedFormats: ['jpg', 'jpeg', 'png', 'gif'],
    // You can also add transformations here if needed
  }
});

const upload = multer({ storage });

module.exports = upload;



// // backend/middlewares/upload.js
// const multer = require("multer");
// const path = require("path");

// // Save files to backend/uploads/
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

// const upload = multer({ storage });

// module.exports = upload;
