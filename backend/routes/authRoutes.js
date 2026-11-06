
const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");


// ========================================
// USER REGISTRATION
// ========================================

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields."
            });
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long."
            });
        }

        // Check if user already exists
        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email is already registered."
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        // Role is automatically set to "user" by the User model
        const newUser = new User({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "Registration successful!"
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error during registration."
        });
    }
});


// ========================================
// USER LOGIN
// ========================================

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter your email and password."
            });
        }

        // Find user by email
        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Compare entered password with hashed password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Get the user's role
        const userRole = user.role || "user";

        // Check that JWT secret is configured
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing from the environment.");
        }

        // Generate JWT token containing user ID and role
        const token = jwt.sign(
            {
                id: user._id,
                role: userRole
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // Send token and user details to frontend
        return res.status(200).json({
            success: true,
            message: "Login successful!",
            token: token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: userRole
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error during login."
        });
    }
});


// ========================================
// PROFILE: VIEW AND UPDATE
// ========================================

function formatProfile(user) {
    return {
        fullName: user.name,
        email: user.email,
        city: user.city || "",
        age: user.age === null || user.age === undefined ? "" : user.age,
        country: user.country || ""
    };
}

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Account not found. Please log in again."
            });
        }

        return res.json({ success: true, profile: formatProfile(user) });

    } catch (error) {
        console.error("Profile fetch error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while loading your profile."
        });
    }
});

router.put("/me", authMiddleware, async (req, res) => {
    try {
        const { fullName, email, city, age, country } = req.body;

        const name = typeof fullName === "string" ? fullName.trim() : "";
        const normalizedEmail =
            typeof email === "string" ? email.trim().toLowerCase() : "";

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Please enter your full name."
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        let ageValue = null;

        if (age !== "" && age !== null && age !== undefined) {
            ageValue = Number(age);

            if (!Number.isFinite(ageValue) || ageValue < 1 || ageValue > 120) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter a valid age."
                });
            }
        }

        // Email must not belong to another account
        const emailOwner = await User.findOne({ email: normalizedEmail });

        if (emailOwner && emailOwner._id.toString() !== req.user.id) {
            return res.status(400).json({
                success: false,
                message: "Email is already registered."
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                name,
                email: normalizedEmail,
                city: typeof city === "string" ? city.trim() : "",
                age: ageValue,
                country: typeof country === "string" ? country.trim() : ""
            },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Account not found. Please log in again."
            });
        }

        return res.json({
            success: true,
            message: "Profile updated successfully!",
            profile: formatProfile(user)
        });

    } catch (error) {
        console.error("Profile update error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while updating your profile."
        });
    }
});


module.exports = router;
