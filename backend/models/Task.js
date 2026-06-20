const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"]
  },
  description: String,
  status: {
    type: String,
    default: "Pending"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Task", TaskSchema);