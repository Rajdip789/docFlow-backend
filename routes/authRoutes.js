const express = require("express");
const {
  login,
  logout,
  refresh
} = require("../controllers/authControllers.js");

const router = express.Router();

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

module.exports = router;
