
const mongoose = require("mongoose");

const rtoReportSchema = new mongoose.Schema(
    {
        // User who submitted the report
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        requestNumber: {
            type: String,
            required: true
        },

        ownerName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            default: ""
        },

        registrationNumber: {
            type: String,
            required: true,
            uppercase: true,
            trim: true
        },

        vehicleId: {
            type: String,
            default: ""
        },

        vehicleName: {
            type: String,
            required: true
        },

        fuel: {
            type: String,
            required: true
        },

        efficiency: {
            type: String,
            default: ""
        },

        emissionFactor: {
            type: Number,
            required: true,
            min: 0
        },

        city: {
            type: String,
            required: true
        },

        odometer: {
            type: Number,
            required: true,
            min: 0
        },

        notes: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: [
                "Pending Review",
                "Approved",
                "Needs Information"
            ],
            default: "Pending Review"
        },

        submittedAt: {
            type: Date,
            default: Date.now
        },

        reviewedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("RTOReport", rtoReportSchema);
