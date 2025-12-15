// const express = require("express");
// const router = express.Router();
// const auth = require("../middlewares/authMiddleware");
// const upload = require("../middlewares/upload");
// const { getUsersFromSameCollege,
//   getCurrentUser,
//   sendFriendRequest,
//   acceptFriendRequest,
//   declineFriendRequest,
//   getFriendRequests,
//   getFriendsList,
// getUserProfile,
//   updateUserProfile } = require("../controllers/userController");
// router.get("/college", auth, getUsersFromSameCollege);
// router.get("/me", auth, getCurrentUser);

// // Friend request routes
// router.post("/friend-request/send", auth, sendFriendRequest);
// router.post("/friend-request/accept", auth, acceptFriendRequest);
// router.post("/friend-request/decline", auth, declineFriendRequest);

// router.get("/friend-requests", auth, getFriendRequests);  // friend requests you received
// router.get("/friends", auth, getFriendsList);

// router.get('/:id', auth, getUserProfile);           // view any user's profile by ID
// router.put('/me', auth, upload.single("profilePic"), updateUserProfile);         // update own profile

// module.exports = router;

//backend/routes/users.js
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload"); // Cloudinary upload middleware

const {
  getUsersFromSameCollege,
  getCurrentUser,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getFriendRequests,
  getFriendsList,
  getUserProfile,
  updateUserProfile
} = require("../controllers/userController");

// Get all users from same college (excluding yourself in controller)
router.get("/college", auth, getUsersFromSameCollege);

// Get your own profile data
router.get("/me", auth, getCurrentUser);

// Friend request routes
router.post("/friend-request/send", auth, sendFriendRequest);
router.post("/friend-request/accept", auth, acceptFriendRequest);
router.post("/friend-request/decline", auth, declineFriendRequest);

// Get pending friend requests you received
router.get("/friend-requests", auth, getFriendRequests);

// Get friend list
router.get("/friends", auth, getFriendsList);

// View any user's profile by ID
router.get('/:id', auth, getUserProfile);

// Update your profile (with optional profilePic upload to Cloudinary)
router.put('/me', auth, upload.single("profilePic"), updateUserProfile);

module.exports = router;
