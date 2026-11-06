const mongoose = require("mongoose");

// A vehicle registered by a user (shown on "My Vehicles")
const vehicleSchema = new mongoose.Schema(
    {
        // Owner of this vehicle
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        fuel: {
            type: String,
            enum: ["Petrol", "Diesel", "Electricity"],
            required: true
        },

        // Number entered by the user (km/L or kWh/km)
        efficiencyValue: {
            type: Number,
            required: true,
            min: 0.0001
        },

        efficiencyUnit: {
            type: String,
            enum: ["km/L", "kWh/km"],
            required: true
        },

        // Display text, e.g. "17.8 km/L"
        efficiency: {
            type: String,
            required: true
        },

        // Emission factor used in carbon calculations (kg CO2e per km)
        kgPerKm: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

// A user cannot have two vehicles with the same name (case-insensitive)
vehicleSchema.index(
    { user: 1, name: 1 },
    { unique: true, collation: { locale: "en", strength: 2 } }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
