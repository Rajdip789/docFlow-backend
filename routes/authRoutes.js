const express = require("express");
const {
  register,
  login,
  logout,
  refresh
} = require("../controllers/authControllers.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

module.exports = router;
