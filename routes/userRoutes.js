const express = require("express");
const {
  getAllDocs,
  updateAccountController,
  deleteAccountController,
} = require("../controllers/userControllers.js");

const router = express.Router();

router.get("/docs/:id", getAllDocs);

router.put("/update-account/:id", updateAccountController);

router.delete("/delete-account/:id", deleteAccountController);

module.exports = router;
