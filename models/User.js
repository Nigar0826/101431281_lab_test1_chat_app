const mongoose = require('mongoose');

// User Schema
// Defines the structure of user data stored in MongoDB.
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    createdOn: { type: Date, default: Date.now }
});

// Export the User model.
// This allows other parts of the application to interact with the User collection in MongoDB.
module.exports = mongoose.model('User', UserSchema);
