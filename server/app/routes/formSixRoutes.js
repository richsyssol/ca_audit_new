const express = require("express");
const router = express.Router();
const formSixController = require("../controllers/formSixController");

router.post("/", formSixController.createFormSix);

module.exports = router;
