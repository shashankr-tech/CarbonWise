
const express = require("express");
const mongoose = require("mongoose");

const RTOReport = require("../models/RTOReport");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

const router = express.Router();

// All RTO routes require login
router.use(authMiddleware);


// ========================================
// USER: SUBMIT VEHICLE INFORMATION
// ========================================

router.post("/", async (req, res) => {
    try {
        const {
            ownerName,
            email,
            registrationNumber,
            vehicleId,
            vehicleName,
            fuel,
            efficiency,
            emissionFactor,
            city,
            odometer,
            notes
        } = req.body;

        // Validate required fields
        if (
            !ownerName ||
            !registrationNumber ||
            !vehicleName ||
            !fuel ||
            emissionFactor === undefined ||
            !city ||
            odometer === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required vehicle details."
            });
        }

        // Validate numeric values
        if (
            !Number.isFinite(Number(emissionFactor)) ||
            Number(emissionFactor) < 0 ||
            !Number.isFinite(Number(odometer)) ||
            Number(odometer) < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid emission factor or odometer reading."
            });
        }

        // Generate request reference number
        const requestNumber = `RTO-${Date.now().toString().slice(-6)}`;

        // Save report in MongoDB
        const savedReport = await RTOReport.create({
            user: req.user.id,
            requestNumber,
            ownerName: ownerName.trim(),
            email: email ? email.trim() : "",
            registrationNumber: registrationNumber.trim().toUpperCase(),
            vehicleId: vehicleId || "",
            vehicleName,
            fuel,
            efficiency: efficiency || "",
            emissionFactor: Number(emissionFactor),
            city: city.trim(),
            odometer: Number(odometer),
            notes: notes || "",
            status: "Pending Review",
            submittedAt: new Date()
        });

        const report = {
            ...savedReport.toObject(),
            id: savedReport._id.toString()
        };

        return res.status(201).json({
            success: true,
            message: "Vehicle information submitted successfully!",
            report
        });

    } catch (error) {
        console.error("RTO submission error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while submitting vehicle information."
        });
    }
});


// ========================================
// USER: VIEW OWN SUBMISSIONS
// ========================================

router.get("/my", async (req, res) => {
    try {
        const reports = await RTOReport.find({
            user: req.user.id
        }).sort({ submittedAt: -1 });

        const formattedReports = reports.map((report) => ({
            ...report.toObject(),
            id: report._id.toString()
        }));

        return res.json({
            success: true,
            count: formattedReports.length,
            reports: formattedReports
        });

    } catch (error) {
        console.error("Error fetching user RTO reports:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching your submissions."
        });
    }
});


// ========================================
// OFFICER: VIEW ALL SUBMISSIONS
// ========================================

router.get(
    "/",
    authorizeRole("officer"),
    async (req, res) => {
        try {
            const reports = await RTOReport.find()
                .sort({ submittedAt: -1 });

            const formattedReports = reports.map((report) => ({
                ...report.toObject(),
                id: report._id.toString()
            }));

            return res.json({
                success: true,
                count: formattedReports.length,
                reports: formattedReports
            });

        } catch (error) {
            console.error("Error fetching all RTO reports:", error);

            return res.status(500).json({
                success: false,
                message: "Server error while fetching RTO submissions."
            });
        }
    }
);


// ========================================
// OFFICER: UPDATE SUBMISSION STATUS
// ========================================

router.patch(
    "/:id/status",
    authorizeRole("officer"),
    async (req, res) => {
        try {
            const { status } = req.body;
            const { id } = req.params;

            // Validate MongoDB ID
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid report ID."
                });
            }

            // Validate status
            const allowedStatuses = [
                "Pending Review",
                "Approved",
                "Needs Information"
            ];

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid submission status."
                });
            }

            const updatedReport = await RTOReport.findByIdAndUpdate(
                id,
                {
                    status,
                    reviewedAt: new Date()
                },
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!updatedReport) {
                return res.status(404).json({
                    success: false,
                    message: "RTO submission not found."
                });
            }

            return res.json({
                success: true,
                message: "Submission status updated successfully!",
                report: {
                    ...updatedReport.toObject(),
                    id: updatedReport._id.toString()
                }
            });

        } catch (error) {
            console.error("Error updating RTO status:", error);

            return res.status(500).json({
                success: false,
                message: "Server error while updating submission status."
            });
        }
    }
);


module.exports = router;
