// Setting up the database connection
const mongoose = require('mongoose');
require('dotenv').config({ quiet: false }); // Load environment variables from .env file

// Connect to MongoDB using Mongoose.
const connectDB = async () => {
    try {
        // Check if .env file to connect your MongoDB database.
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch(error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

// Export the connectDB function to use it in other files.
module.exports = connectDB;