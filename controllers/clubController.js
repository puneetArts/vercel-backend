const Club = require('../models/Club');
const { recommendClubs } = require('../ai/recommend');



exports.createClub = async (req, res) => {
  try {
    const { name, description, tags, college } = req.body;
    const club = new Club({ name, description, tags, college });
    await club.save();
    res.status(201).json(club);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const { interests } = req.body; // array of interests from frontend
    const clubs = await Club.find();
    const recommendations = await recommendClubs(interests, clubs);
    res.json({ recommendations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// // Pseudocode for better scoring
// function calculateMatch(interests, clubTags) {
//   let score = 0;

//   // Convert to lowercase arrays
//   const interestSet = new Set(interests.map(i => i.toLowerCase()));
//   const tagSet = new Set(clubTags.map(t => t.toLowerCase()));

//   // Exact matches → big score
//   interestSet.forEach((interest) => {
//     if (tagSet.has(interest)) {
//       score += 1; // full match
//     }
//   });

//   // Percentage of overlap
//   return score / tagSet.size;
// }