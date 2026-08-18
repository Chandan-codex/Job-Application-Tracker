const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["Applied", "Shortlisted", "Interview", "Selected", "Rejected"],
      default: "Applied",
    },
    applicationDate: {
      type: Date,
      required: [true, "Application date is required"],
    },
    interviewDate: {
      type: Date,
    },
    jobType: {
      type: String,
      enum: ["Internship", "Full-time", "Part-time"],
    },
    location: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);
