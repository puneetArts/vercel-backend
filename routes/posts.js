// const express = require('express');
// const router = express.Router();
// const { createPost, getUserPosts, getCollegePosts } = require('../controllers/postController');
// const auth = require('../middlewares/authMiddleware');
// const upload = require('../middlewares/upload'); // for post image

// router.post('/', auth, upload.single('image'), createPost);
// router.get('/user/:userId', auth, getUserPosts);
// router.get('/college', auth, getCollegePosts);

// module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createPost,
  getUserPosts,
  getCollegePosts
} = require('../controllers/postController');
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload'); // Cloudinary upload middleware

// Create a new post with optional image
router.post('/', auth, upload.single('image'), createPost);

// Get all posts by a specific user (newest first)
router.get('/user/:userId', auth, getUserPosts);

// Get all posts for your college (newest first)
router.get('/college', auth, getCollegePosts);

module.exports = router;
