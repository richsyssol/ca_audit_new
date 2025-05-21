const express = require("express");
const router = express.Router();
const formEightController = require("../controllers/formEightController");

router.post("/preview", formEightController.previewPDF);
router.get("/temp-preview/:filename", formEightController.serveTempPDF);
router.post("/approve", formEightController.handleApproval);

module.exports = router;
