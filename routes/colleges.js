//backend/routes/colleges.js

const express = require('express');
const router = express.Router();
const { addCollege, getColleges } = require('../controllers/collegeController');

// Get all colleges
router.get('/', getColleges);

// Add a new college (auth optional)
router.post('/', addCollege);

module.exports = router;
