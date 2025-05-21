// const express = require("express");
// const router = express.Router();
// const formSevenController = require("../controllers/formSevenController");

// router.post("/preview", formSevenController.createFormSeven);

// router.get("/temp-preview/:filename", formSevenController.serveTempPDF);
// router.post("/approve", formSevenController.handleApproval);
// module.exports = router;

const express = require("express");
const router = express.Router();
const formSevenController = require("../controllers/formSevenController");

// All these should show 'function' when you run the debug code
//router.post("/preview", formSevenController.previewPDF);
//router.get("/temp-preview/:filename", formSevenController.serveTempPDF);
//router.post("/approve", formSevenController.handleApproval); // Must match export

module.exports = router;
