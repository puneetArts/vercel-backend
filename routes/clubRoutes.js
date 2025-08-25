const express = require('express');
const { createClub, getRecommendations } = require('../controllers/clubController');
const router = express.Router();

router.post('/create', createClub);
router.post('/recommend', getRecommendations);

module.exports = router;
