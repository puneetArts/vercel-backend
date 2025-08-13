const express = require('express');
const router = express.Router();
const { createAchievement, getUserAchievements, getCollegeAchievements } = require('../controllers/achievementController');
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload'); // for certificate

router.post('/', auth, upload.single('certificate'), createAchievement);
router.get('/user/:userId', auth, getUserAchievements);
router.get('/college', auth, getCollegeAchievements);

module.exports = router;
