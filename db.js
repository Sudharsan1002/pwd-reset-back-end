const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");

const MONGODBURI = process.env.MONGODB_URI;

if (!MONGODBURI) {
  console.error("MONGODB_URI is not defined. Please check your .env file.");
  process.exit(1); // Stop the application if the URI is missing
} else {
  console.log("Connecting to MongoDB URI:", MONGODBURI); // Debugging
}

async function createDBConnection() {
  try {
    const response = await mongoose.connect(MONGODBURI);
    console.log("Connected to DB");
  } catch (error) {
    console.log("FAILED", error.message);
  }
}

module.exports = {
  createDBConnection,
};
