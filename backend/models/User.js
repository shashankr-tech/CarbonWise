
const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema(
    {
        // User name
        name: {
            type: String,
            required: true,
            trim: true
        },

        // Email address
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        // Hashed password
        password: {
            type: String,
            required: true
        },

        // User role
        role: {
            type: String,
            enum: ["user", "officer"],
            default: "user"
        },

        // Profile details
        city: {
            type: String,
            trim: true,
            default: ""
        },

        age: {
            type: Number,
            min: 1,
            max: 120,
            default: null
        },

        country: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

// Create and export the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
