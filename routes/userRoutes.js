const express = require("express");
const {
	createUser
} = require("../controllers/userControllers.js");

const router = express.Router();

//router.post("/create-user", createUser);

module.exports = router;
