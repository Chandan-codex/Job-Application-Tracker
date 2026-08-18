const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} = require("../controllers/applicationController");

// Protect all application routes with JWT authentication
router.use(authMiddleware);

router.route("/").get(getApplications).post(createApplication);
router.route("/:id").put(updateApplication).delete(deleteApplication);

module.exports = router;
