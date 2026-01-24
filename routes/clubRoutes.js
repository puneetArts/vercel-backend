// backend/routes/clubRoutes.js
const express = require('express');
const router = express.Router();

const auth = require("../middlewares/authMiddleware");         // Auth middleware
const authorizeRoles = require("../middlewares/roleMiddleware"); // Role-based middleware

const { createClub, getRecommendations } = require('../controllers/clubController');

// Only ambassador can create a club
router.post('/create', auth, authorizeRoles("ambassador"), createClub);

// Anyone logged in can get recommendations
router.post('/recommend', getRecommendations); // NO auth

module.exports = router;
