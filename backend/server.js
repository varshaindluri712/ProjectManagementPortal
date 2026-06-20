require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { protect } = require("./middleware/auth");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("Project Management API Running");
});

// Auth routes
app.use("/api/auth", require("./routes/authRoutes"));

// Protected task routes
app.use("/api/tasks", protect, require("./routes/taskRoutes"));

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;