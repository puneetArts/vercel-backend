const Post = require('../models/Post');
const cloudinary = require("cloudinary").v2;

// exports.createPost = async (req, res) => {
//   try {
//     const { content } = req.body;

//     const post = new Post({
//       user: req.user._id,
//       college: req.user.college,
//       content,
//       image: req.file ? `/uploads/${req.file.filename}` : undefined
//     });

//     await post.save();
//     res.json({ msg: 'Post created', post });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// exports.getUserPosts = async (req, res) => {
//   try {
//     const posts = await Post.find({ user: req.params.userId })
//       .populate('user', 'name profilePic')
//       .sort({ createdAt: -1 });
//     res.json(posts);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// exports.getCollegePosts = async (req, res) => {
//   try {
//     const posts = await Post.find({ college: req.user.college })
//       .populate('user', 'name profilePic')
//       .sort({ createdAt: -1 });
//     res.json(posts);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };


exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;

    const post = new Post({
      user: req.user._id,
      college: req.user.college,
      content,
      image: req.file ? req.file.path : undefined // ✅ Cloudinary URL
    });

    await post.save();
    res.json({ msg: 'Post created', post });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate('user', 'name profilePic')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getCollegePosts = async (req, res) => {
  try {
    const posts = await Post.find({ college: req.user.college })
      .populate('user', 'name profilePic')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
