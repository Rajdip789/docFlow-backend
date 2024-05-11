const express = require("express");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
  getAllDocs,
  updateAccountController,
  deleteAccountController,
} = require("../controllers/userControllers.js");

const router = express.Router();

router.get("/docs/:id", getAllDocs);

router.put("/update-account/:id", upload.single('image'), updateAccountController);

router.delete("/delete-account/:id", deleteAccountController);

module.exports = router;
