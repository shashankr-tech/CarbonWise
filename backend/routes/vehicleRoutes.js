
const express = require("express");
const mongoose = require("mongoose");

const Vehicle = require("../models/Vehicle");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All vehicle routes require login
router.use(authMiddleware);

const GRID_ELECTRICITY_FACTOR = 0.675;
const FUELS = ["Petrol", "Diesel", "Electricity"];

// Calculate vehicle emission details
// The backend is the source of truth for kgPerKm.
function buildVehicleFields(name, fuel, efficiencyValue) {
    const efficiencyUnit =
        fuel === "Electricity" ? "kWh/km" : "km/L";

    let kgPerKm;

    if (fuel === "Petrol") {
        kgPerKm = 2.30 / efficiencyValue;
    } else if (fuel === "Diesel") {
        kgPerKm = 2.685 / efficiencyValue;
    } else {
        kgPerKm = efficiencyValue * GRID_ELECTRICITY_FACTOR;
    }

    return {
        name,
        fuel,
        efficiencyValue,
        efficiencyUnit,
        efficiency: `${efficiencyValue} ${efficiencyUnit}`,
        kgPerKm
    };
}

// Validate vehicle information
function validateBody(body = {}) {
    const name =
        typeof body.name === "string"
            ? body.name.trim()
            : "";

    const fuel = body.fuel;
    const efficiencyValue = Number(body.efficiencyValue);

    if (!name) {
        return {
            error: "Please enter a vehicle name."
        };
    }

    if (!FUELS.includes(fuel)) {
        return {
            error: "Please choose a valid fuel type."
        };
    }

    if (
        !Number.isFinite(efficiencyValue) ||
        efficiencyValue <= 0
    ) {
        return {
            error: "Please enter a valid efficiency value."
        };
    }

    return {
        fields: buildVehicleFields(
            name,
            fuel,
            efficiencyValue
        )
    };
}

// Format vehicle response
function formatVehicle(vehicle) {
    const object = vehicle.toObject();

    object.id = vehicle._id.toString();

    delete object.__v;

    return object;
}

// ========================================
// GET ALL VEHICLES FOR LOGGED-IN USER
// ========================================

router.get("/", async (req, res) => {
    try {
        // Retrieve only the logged-in user's vehicles
        const vehicles = await Vehicle.find({
            user: req.user.id
        }).sort({ createdAt: 1 });

        return res.json({
            success: true,
            count: vehicles.length,
            vehicles: vehicles.map(formatVehicle)
        });

    } catch (error) {
        console.error("Error fetching vehicles:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching vehicles."
        });
    }
});

// ========================================
// ADD A VEHICLE
// ========================================

router.post("/", async (req, res) => {
    try {
        const { error, fields } = validateBody(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error
            });
        }

        // Associate the vehicle with the logged-in user
        const vehicle = await Vehicle.create({
            user: req.user.id,
            ...fields
        });

        return res.status(201).json({
            success: true,
            message: "Vehicle added successfully!",
            vehicle: formatVehicle(vehicle)
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "A vehicle with this name already exists."
            });
        }

        console.error("Error adding vehicle:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while adding vehicle."
        });
    }
});

// ========================================
// EDIT A VEHICLE
// ========================================

router.put("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid vehicle ID."
            });
        }

        const { error, fields } = validateBody(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error
            });
        }

        // Update only if the vehicle belongs to this user
        const vehicle = await Vehicle.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            fields,
            {
                new: true,
                runValidators: true
            }
        );

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found."
            });
        }

        return res.json({
            success: true,
            message: "Vehicle updated successfully!",
            vehicle: formatVehicle(vehicle)
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "A vehicle with this name already exists."
            });
        }

        console.error("Error updating vehicle:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while updating vehicle."
        });
    }
});

// ========================================
// DELETE A VEHICLE
// ========================================

router.delete("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid vehicle ID."
            });
        }

        // Delete only if the vehicle belongs to this user
        const deleted = await Vehicle.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found."
            });
        }

        return res.json({
            success: true,
            message: "Vehicle deleted successfully!"
        });

    } catch (error) {
        console.error("Error deleting vehicle:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while deleting vehicle."
        });
    }
});

module.exports = router;
