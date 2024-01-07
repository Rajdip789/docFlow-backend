const express = require("express");
const {
  googleLogin,
  register,
  login,
  logout,
  refresh
} = require("../controllers/authControllers.js");

const router = express.Router();

router.post("/google", googleLogin);
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

module.exports = router;
