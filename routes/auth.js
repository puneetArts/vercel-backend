// const express = require("express");
// const router = express.Router();
// const { signup, login } = require("../controllers/authController");

// router.post("/signup", signup);
// router.post("/login", login);

// module.exports = router;

const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");

// Signup route
router.post("/signup", signup);

// Login route
router.post("/login", login);

module.exports = router;
