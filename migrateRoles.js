// migrateRoles.js
const mongoose = require("mongoose");
const User = require("./models/User"); // adjust path if needed
require("dotenv").config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected!");
};

const addRoles = async () => {
  try {
    const users = await User.find({ role: { $exists: false } });
    console.log("Users to update:", users.length);

    for (let user of users) {
      await User.updateOne({ _id: user._id }, { $set: { role: "student" } });
    }

    console.log("Roles added successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
};


connectDB().then(addRoles);
