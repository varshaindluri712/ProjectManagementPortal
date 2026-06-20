const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"]
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre("save", async function() {
  // Only hash if password is modified
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
