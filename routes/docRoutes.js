const express = require("express");
const {
  createDocController,
  renameDocController,
  deleteDocController,
} = require("../controllers/docControllers.js");

const router = express.Router();

router.post("/create-docs", createDocController);

router.put("/rename-docs/:id", renameDocController);

router.delete("/delete-docs/:id", deleteDocController);

module.exports = router;
