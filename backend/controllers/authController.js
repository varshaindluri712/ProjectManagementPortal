const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Register user
const register = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    // Validation
    if (!name || !email || !password || !passwordConfirm) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Check if email exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user with password field
    const user = await User.findOne({ email }).select("+password");
    
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check password
    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };
