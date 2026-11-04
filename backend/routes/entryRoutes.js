
const express = require("express");
const mongoose = require("mongoose");
const Entry = require("../models/Entry");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protect all routes in this file
router.use(authMiddleware);

// ADD A CARBON ENTRY
router.post("/", async (req, res) => {
    try {
        const {
            category,
            activity,
            quantity,
            unit,
            emissionFactor,
            factorUnit,
            formula,
            emissions,
            date,
            transportMode,
            vehicle,
            fuelType
        } = req.body;

        // Validate required fields
        if (
            !category ||
            !activity ||
            quantity === undefined ||
            !unit ||
            emissionFactor === undefined ||
            !factorUnit ||
            emissions === undefined ||
            !date
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required carbon entry details."
            });
        }

        // Validate numeric values
        if (
            !Number.isFinite(Number(quantity)) ||
            Number(quantity) <= 0 ||
            !Number.isFinite(Number(emissionFactor)) ||
            Number(emissionFactor) < 0 ||
            !Number.isFinite(Number(emissions)) ||
            Number(emissions) < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid quantity, emission factor, or emissions value."
            });
        }

        // Save the entry with the logged-in user's ID
        const savedEntry = await Entry.create({
            user: req.user.id,
            category,
            activity,
            transportMode: transportMode || null,
            vehicle: vehicle || null,
            fuelType: fuelType || null,
            quantity: Number(quantity),
            unit,
            emissionFactor: Number(emissionFactor),
            factorUnit,
            formula: formula || "",
            emissions: Number(emissions),
            date
        });

        // Prepare the response for the frontend
        const entry = {
            ...savedEntry.toObject(),
            id: savedEntry._id.toString()
        };

        return res.status(201).json({
            success: true,
            message: "Carbon entry added successfully!",
            entry
        });

    } catch (error) {
        console.error("Error saving carbon entry:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while saving carbon entry."
        });
    }
});


// GET ALL CARBON ENTRIES FOR THE LOGGED-IN USER
router.get("/", async (req, res) => {
    try {
        // Only retrieve entries belonging to this user
        const savedEntries = await Entry.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        const entries = savedEntries.map((entry) => ({
            ...entry.toObject(),
            id: entry._id.toString()
        }));

        return res.json({
            success: true,
            count: entries.length,
            entries
        });

    } catch (error) {
        console.error("Error fetching carbon entries:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching carbon entries."
        });
    }
});


// DELETE A CARBON ENTRY
router.delete("/:id", async (req, res) => {
    try {
        // Validate MongoDB entry ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid carbon entry ID."
            });
        }

        // Delete only if the entry belongs to this user
        const deletedEntry = await Entry.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!deletedEntry) {
            return res.status(404).json({
                success: false,
                message: "Carbon entry not found."
            });
        }

        return res.json({
            success: true,
            message: "Carbon entry deleted successfully!"
        });

    } catch (error) {
        console.error("Error deleting carbon entry:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while deleting carbon entry."
        });
    }
});

module.exports = router;
