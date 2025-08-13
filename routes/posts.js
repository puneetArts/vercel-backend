const express = require('express');
const router = express.Router();
const { createPost, getUserPosts, getCollegePosts } = require('../controllers/postController');
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload'); // for post image

router.post('/', auth, upload.single('image'), createPost);
router.get('/user/:userId', auth, getUserPosts);
router.get('/college', auth, getCollegePosts);

module.exports = router;
