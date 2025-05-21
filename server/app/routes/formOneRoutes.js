const express = require("express");
const router = express.Router();
const formOneController = require("../controllers/formOneController");

router.post("/", formOneController.createFormOne);
// router.get("/", formOneController.getAllForms);
// router.get("/:id", formOneController.getFormOneById);
// router.put("/:id", formOneController.updateFormOne);
// router.delete("/:id", formOneController.deleteFormOne);
// router.get("/pdf/:id", formOneController.generateFormOnePDF); // PDF Generator

module.exports = router;
