const College = require("../models/College");

exports.getColleges = async (req, res) => {
  const colleges = await College.find();
  res.json(colleges);
};

// For seeding colleges (can remove later)
exports.addCollege = async (req, res) => {
  const { name, domain } = req.body;
  const college = new College({ name, domain });
  await college.save();
  res.json(college);
};
