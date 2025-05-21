const express = require("express");
const router = express.Router();
const formTwoController = require("../controllers/formTwoController");

router.post("/", formTwoController.createFormTwo);

module.exports = router;
