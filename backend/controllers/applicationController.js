const Application = require("../models/Application");

// @desc    Get all applications for the logged-in user
// @route   GET /api/applications
// @access  Private
const getApplications = async (req, res, next) => {
  try {
    // Strictly find applications belonging ONLY to the authenticated user
    const applications = await Application.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new application
// @route   POST /api/applications
// @access  Private
const createApplication = async (req, res, next) => {
  try {
    const {
      company,
      position,
      status,
      applicationDate,
      interviewDate,
      jobType,
      location,
      notes,
    } = req.body;

    // Validate required fields
    if (!company || !position || !applicationDate) {
      return res.status(400).json({
        message: "Please provide company, position, and application date",
      });
    }

    // Security Rule: NEVER accept user ID from request body.
    // Always use req.user.id attached by the verified JWT middleware.
    const application = await Application.create({
      company: company.trim(),
      position: position.trim(),
      status: status || "Applied",
      applicationDate,
      interviewDate: interviewDate ? new Date(interviewDate) : undefined,
      jobType: jobType || undefined,
      location: location ? location.trim() : "",
      notes: notes ? notes.trim() : "",
      user: req.user.id,
    });

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing application
// @route   PUT /api/applications/:id
// @access  Private
const updateApplication = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the application and ensure it belongs to the authenticated user
    const application = await Application.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found or unauthorized",
      });
    }

    const {
      company,
      position,
      status,
      applicationDate,
      interviewDate,
      jobType,
      location,
      notes,
    } = req.body;

    // Update fields if provided
    if (company !== undefined) application.company = company.trim();
    if (position !== undefined) application.position = position.trim();
    if (status !== undefined) application.status = status;
    if (applicationDate !== undefined) application.applicationDate = applicationDate;
    if (interviewDate !== undefined) {
      application.interviewDate = interviewDate ? new Date(interviewDate) : undefined;
    }
    if (jobType !== undefined) application.jobType = jobType || undefined;
    if (location !== undefined) application.location = location ? location.trim() : "";
    if (notes !== undefined) application.notes = notes ? notes.trim() : "";

    const updatedApplication = await application.save();

    res.status(200).json(updatedApplication);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an application
// @route   DELETE /api/applications/:id
// @access  Private
const deleteApplication = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Strictly find and delete only if the application belongs to the authenticated user
    const application = await Application.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found or unauthorized",
      });
    }

    res.status(200).json({
      message: "Application deleted successfully",
      id: id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
};
