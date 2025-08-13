// const express = require('express');
// const router = express.Router();
// const { createAchievement, getUserAchievements, getCollegeAchievements } = require('../controllers/achievementController');
// const auth = require('../middlewares/authMiddleware');
// const upload = require('../middlewares/upload'); // for certificate

// router.post('/', auth, upload.single('certificate'), createAchievement);
// router.get('/user/:userId', auth, getUserAchievements);
// router.get('/college', auth, getCollegeAchievements);

// module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createAchievement,
  getUserAchievements,
  getCollegeAchievements
} = require('../controllers/achievementController');
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload'); // Cloudinary upload middleware

// Create new achievement with optional certificate upload
router.post('/', auth, upload.single('certificate'), createAchievement);

// Get all achievements for a specific user
router.get('/user/:userId', auth, getUserAchievements);

// Get all achievements for your college
router.get('/college', auth, getCollegeAchievements);

module.exports = router;
