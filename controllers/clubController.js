const Club = require('../models/Club');
const User = require('../models/User');
const College = require('../models/College');
const mongoose = require('mongoose');
const { recommendClubs } = require('../ai/recommend');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

exports.createClub = async (req, res) => {
  try {
    const { name, description, tags, college } = req.body;
    if (!name) return res.status(400).json({ error: "Club name is required" });

    const normalizedTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
        ? tags.split(',').map(t => t.trim()).filter(Boolean)
        : [];

    let collegeId = req.user.college;

    if (college) {
      const trimmed = typeof college === "string" ? college.trim() : "";
      if (trimmed) {
        if (mongoose.Types.ObjectId.isValid(trimmed)) {
          collegeId = trimmed;
        } else {
          const match = await College.findOne({
            name: new RegExp(`^${escapeRegex(trimmed)}\\s*$`, "i")
          }).select("_id");
          if (!match) return res.status(400).json({ error: "College not found" });
          collegeId = match._id;
        }
      }
    }

    const club = await Club.create({
      name,
      description,
      tags: normalizedTags,
      college: collegeId,
      createdBy: req.user._id
    });

    res.status(201).json(club);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const { interests } = req.body;

    const freshUser = await User.findById(req.user._id).populate("college", "name");

    const finalInterests = Array.isArray(interests) && interests.length > 0
      ? interests
      : Array.isArray(freshUser?.interests) ? freshUser.interests : [];

    if (finalInterests.length === 0) {
      return res.status(400).json({ error: "Interests are required for recommendations" });
    }

    const collegeId = freshUser?.college?._id;
    let clubs = collegeId ? await Club.find({ college: collegeId }) : [];
    if (clubs.length === 0) clubs = await Club.find();

    const recommendations = await recommendClubs(finalInterests, clubs);

    const joinedSet = new Set((freshUser?.joinedClubs || []).map(id => id.toString()));
    const enriched = recommendations.map(club => ({
      ...club,
      memberCount: Array.isArray(club.members) ? club.members.length : 0,
      joined: joinedSet.has(club._id.toString())
    }));

    res.json({ recommendations: enriched });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.joinClub = async (req, res) => {
  try {
    const userId = req.user._id;
    const { clubId } = req.params;

    const [club, user] = await Promise.all([
      Club.findById(clubId),
      User.findById(userId)
    ]);

    if (!club) return res.status(404).json({ error: "Club not found" });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.joinedClubs.some(id => id.toString() === clubId)) {
      return res.status(400).json({ error: "Already joined this club" });
    }

    user.joinedClubs.push(club._id);
    if (!club.members.some(id => id.toString() === userId.toString())) {
      club.members.push(userId);
    }

    await Promise.all([user.save(), club.save()]);
    res.json({ msg: "Joined club successfully", clubId: club._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.leaveClub = async (req, res) => {
  try {
    const userId = req.user._id;
    const { clubId } = req.params;

    const [club, user] = await Promise.all([
      Club.findById(clubId),
      User.findById(userId)
    ]);

    if (!club) return res.status(404).json({ error: "Club not found" });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.joinedClubs.some(id => id.toString() === clubId)) {
      return res.status(400).json({ error: "You are not a member of this club" });
    }

    user.joinedClubs = user.joinedClubs.filter(id => id.toString() !== clubId);
    club.members = club.members.filter(id => id.toString() !== userId.toString());

    await Promise.all([user.save(), club.save()]);
    res.json({ msg: "Left club successfully", clubId: club._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJoinedClubs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "joinedClubs",
      populate: [
        { path: "college", select: "name" },
        { path: "createdBy", select: "name email" }
      ]
    });
    res.json({ joinedClubs: user?.joinedClubs || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
