const express = require("express");
const router = express.Router();
const formFiveController = require("../controllers/formFiveController");

router.post("/", formFiveController.createFormFive);

module.exports = router;
