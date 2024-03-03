const express = require("express");
const {
  getDocInfoController,
  createDocController,
  renameDocController,
  deleteDocController,
  addEmailAccess,
  updateEmailAccess,
  addLinkAccess,
} = require("../controllers/docControllers.js");

const router = express.Router();

router.post("/create-docs", createDocController);

router.put("/rename-docs/:id", renameDocController);

router.delete("/delete-docs/:id", deleteDocController);

router.get("/get-docs-info/:id", getDocInfoController);

router.put("/add-email-access", addEmailAccess);

router.put("/update-email-access", updateEmailAccess);

router.put("/add-link-access", addLinkAccess);

module.exports = router;
