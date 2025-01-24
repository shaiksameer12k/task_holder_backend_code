const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  orgPassword: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const userTasksSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Completed", "Incomplete"],
      default: "Incomplete",
    },
  },
  { timestamps: true }
);

const userProfileSchema = new mongoose.Schema(
  {
    registeredUserId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userBio: {
      type: String,
      value: "",
    },
    userProfile: {
      type: String,
      value: "",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    userTasks: {
      type: [userTasksSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const users = new mongoose.model("chatusers", userSchema);

const userprofiles = new mongoose.model("userprofiles", userProfileSchema);

module.exports = { users, userprofiles };
