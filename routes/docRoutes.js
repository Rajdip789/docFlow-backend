const express = require("express");
const {
  getDocInfoController,
  createDocController,
  renameDocController,
  deleteDocController,
  addEmailAccess,
  updateEmailAccess,
  addLinkAccess,
  getDocContent,
  saveComment,
  getComments,
  deleteComment,
  editComment
} = require("../controllers/docControllers.js");

const router = express.Router();

router.post("/create-docs", createDocController);

router.put("/rename-docs/:id", renameDocController);

router.delete("/delete-docs/:id", deleteDocController);

router.get("/get-docs-info/:id", getDocInfoController);

router.get("/get-docs-content/:id", getDocContent);

router.put("/add-email-access", addEmailAccess);

router.put("/update-email-access", updateEmailAccess);

router.put("/add-link-access", addLinkAccess);

router.post("/save-comment", saveComment);

router.get("/get-comments/:id", getComments);

router.delete("/delete-comment/:id", deleteComment);

router.put("/edit-comment/:id", editComment);

module.exports = router;
