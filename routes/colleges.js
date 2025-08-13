const express = require('express');
const router = express.Router();
const { addCollege, getColleges } = require('../controllers/collegeController');
const auth = require('../middlewares/authMiddleware'); // if you want to protect this, optional

router.get('/', getColleges);
router.post('/',/* auth, optional */ addCollege);

module.exports = router;
