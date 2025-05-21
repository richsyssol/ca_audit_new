const express = require("express");
const authController = require("../controllers/authController");
const { authenticate } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);
router.get("/me", authenticate, authController.getEmp);

module.exports = router;
