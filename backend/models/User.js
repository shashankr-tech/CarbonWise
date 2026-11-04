
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
}
    },
    {
        timestamps: true
    }
);

// Create and export the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
