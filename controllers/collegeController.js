const College = require("../models/College");

// exports.getColleges = async (req, res) => {
//   const colleges = await College.find();
//   res.json(colleges);
// };

// // For seeding colleges (can remove later)
// exports.addCollege = async (req, res) => {
//   const { name, domain } = req.body;
//   const college = new College({ name, domain });
//   await college.save();
//   res.json(college);
// };
exports.getColleges = async (req, res) => {
  try {
    const colleges = await College.find({});
    res.json(colleges); // Make sure this is a plain array!
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
    res.status(201).json(college);
  } catch (error) {
    console.error("Error adding college:", error);
    res.status(500).json({ msg: "Server error adding college" });
  }
};
