const Achievement = require('../models/Achievement');

exports.createAchievement = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    const achievement = new Achievement({
      user: req.user._id,
      college: req.user.college,
      title,
      description,
      date,
      certificate: req.file ? `/uploads/${req.file.filename}` : undefined
    });

    await achievement.save();
    res.json({ msg: 'Achievement added', achievement });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getUserAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({ user: req.params.userId })
      .populate('user', 'name profilePic');
    res.json(achievements);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getCollegeAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({ college: req.user.college })
      .populate('user', 'name profilePic');
    res.json(achievements);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
