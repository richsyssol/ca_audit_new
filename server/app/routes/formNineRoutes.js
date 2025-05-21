const express = require("express");
const router = express.Router();
const formNineController = require("../controllers/formNineController");

// Generate PDF for Preview (No DB entry yet)
router.post("/preview", formNineController.previewPDF);

// Serve Temporary PDF for Preview
router.get("/temp-preview/:filename", formNineController.serveTempPDF);
// http://localhost:8077/api/v1/formNine/temp-preview/Form9_1741823874503.pdf
// Approve or Reject Form
router.post("/approve", formNineController.handleApproval);

module.exports = router;
