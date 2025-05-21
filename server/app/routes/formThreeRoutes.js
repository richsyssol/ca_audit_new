const express = require("express");
const router = express.Router();
const formThreeController = require("../controllers/formThreeController");

router.post("/", formThreeController.createFormThree);

module.exports = router;
