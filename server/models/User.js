const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Define the User schema
const AutoIncrement = require('mongoose-sequence')(mongoose); // Import the auto-increment plugin

const habitSchema = new Schema({
    name: { type: String, required: true },
    frequency: { type: String, required: true, enum: ['Daily', 'Weekly', 'Monthly'] },
    history: [{ date: Date, completed: Boolean }],
    streak: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now, immutable: true },
    updatedAt: { type: Date, default: Date.now }
});

// This schema defines the structure of a User document in MongoDB.
const userSchema = new Schema({
    userId: { type: Number, index: true }, /// Custom integer ID for the user.
    // username: { type: String, required: true },
    habits: [habitSchema],
});

// Apply the auto-increment plugin to the userId field
userSchema.plugin(AutoIncrement, { inc_field: 'userId', start_seq: 1 }); // Apply auto-increment plugin to userId

// Create a Mongoose model for the User schema
const User = mongoose.model('User', userSchema);

// Export the User model to use it in other files.
module.exports = User;