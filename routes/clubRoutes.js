const express = require('express');
const router = express.Router();

const auth = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const {
  createClub,
  getRecommendations,
  joinClub,
  leaveClub,
  getJoinedClubs
} = require('../controllers/clubController');

// Static routes first (must be before /:clubId)
router.post('/create', auth, authorizeRoles('ambassador'), createClub);
router.post('/recommend', auth, getRecommendations);
router.get('/joined', auth, getJoinedClubs);

// Dynamic routes after
router.post('/:clubId/join', auth, joinClub);
router.post('/:clubId/leave', auth, leaveClub);

module.exports = router;
