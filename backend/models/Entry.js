
const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema(
    {
        // Link this entry to the user who created it
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        category: {
            type: String,
            required: true
        },

        activity: {
            type: String,
            required: true
        },

        transportMode: {
            type: String,
            default: null
        },

        vehicle: {
            type: String,
            default: null
        },

        fuelType: {
            type: String,
            default: null
        },

        quantity: {
            type: Number,
            required: true,
            min: 0
        },

        unit: {
            type: String,
            required: true
        },

        emissionFactor: {
            type: Number,
            required: true,
            min: 0
        },

        factorUnit: {
            type: String,
            required: true
        },

        formula: {
            type: String,
            default: ""
        },

        emissions: {
            type: Number,
            required: true,
            min: 0
        },

        date: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Entry", entrySchema);
