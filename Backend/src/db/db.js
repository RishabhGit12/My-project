const mongoose = require("mongoose");

//Function to connect to MongoDB
function connectDB() {
  mongoose.connect(process.env.MONGODB_URI).then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.log("MondoDB connection error:", err);
    });
}

module.exports = connectDB;