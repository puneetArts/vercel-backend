//backend/controllers/collegeController.js
// const College = require("../models/College");


// exports.getColleges = async (req, res) => {
//   try {
//     const colleges = await College.find({});
//     res.json(colleges); // Make sure this is a plain array!
//   } catch (error) {
//     console.error("Error fetching colleges:", error);
//     res.status(500).json({ msg: "Server error fetching colleges" });
//   }
// };

// exports.addCollege = async (req, res) => {
//   try {
//     const { name, domain } = req.body;
//     const college = new College({ name, domain });
//     await college.save();
//     res.status(201).json(college);
//   } catch (error) {
//     console.error("Error adding college:", error);
//     res.status(500).json({ msg: "Server error adding college" });
//   }
// };
const College = require("../models/College");

// Simple in-memory cache
let cachedColleges = null;
let lastFetchedTime = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

exports.getColleges = async (req, res) => {
  try {
    // Serve from cache if valid
    if (
      cachedColleges &&
      lastFetchedTime &&
      Date.now() - lastFetchedTime < CACHE_DURATION
    ) {
      return res.json(cachedColleges);
    }

    // Fetch minimal data from DB
    const colleges = await College.find(
      {},
      { name: 1 } // only _id and name
    ).lean();

    // Save to cache
    cachedColleges = colleges;
    lastFetchedTime = Date.now();

    res.json(colleges);
  } catch (error) {
    console.error("Error fetching colleges:", error);
    res.status(500).json({ msg: "Server error fetching colleges" });
  }
};

exports.addCollege = async (req, res) => {
  try {
    const { name, domain } = req.body;

    const college = new College({ name, domain });
    await college.save();

    // Invalidate cache when new college added
    cachedColleges = null;
    lastFetchedTime = null;

    res.status(201).json(college);
  } catch (error) {
    console.error("Error adding college:", error);
    res.status(500).json({ msg: "Server error adding college" });
  }
};
