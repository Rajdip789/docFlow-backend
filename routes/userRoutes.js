const express = require("express");
const {
	getAllDocs
} = require("../controllers/userControllers.js");

const router = express.Router();

router.get("/docs/:id", getAllDocs);

module.exports = router;
