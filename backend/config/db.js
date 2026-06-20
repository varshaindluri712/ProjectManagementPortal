const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbName = process.env.NODE_ENV === "test" ? "projectdb_test" : "projectdb";
    const uri = process.env.MONGODB_URI || `mongodb://127.0.0.1:27017/${dbName}`;
    await mongoose.connect(uri);
    if (process.env.NODE_ENV !== "test") {
      console.log("MongoDB Connected");
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;