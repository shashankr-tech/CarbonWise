
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const entryRoutes = require("./routes/entryRoutes");
const rtoRoutes = require("./routes/rtoRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");

// Create Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/entries", entryRoutes);
app.use("/api/rto", rtoRoutes);
app.use("/api/vehicles", vehicleRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("CarbonWise Backend is running!");
});

// API health-check route
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "CarbonWise API is working!"
    });
});

// Server port
const PORT = process.env.PORT || 5000;

// MongoDB connection
const MONGO_URI =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/carbonwisedb";

// Connect to MongoDB and start the server
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB successfully!");

        app.listen(PORT, () => {
            console.log(`CarbonWise server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    });
