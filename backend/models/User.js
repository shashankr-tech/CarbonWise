
const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: { type: String, required: true },

role: {
    type: String,
    enum: ["user", "officer"],
    default: "user"
},

        // Profile details (editable on the Profile page)
        city: { type: String, trim: true, default: "" },

        age: { type: Number, min: 1, max: 120, default: null },

        country: { type: String, trim: true, default: "" },

        // Becomes true after the default vehicles are added once
        vehiclesSeeded: { type: Boolean, default: false }
    },
    {
        timestamps: true
    }
);

// Create and export the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
