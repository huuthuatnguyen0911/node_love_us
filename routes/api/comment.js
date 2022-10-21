const express = require("express");
const router = express.Router();

const CommentsController = require("../../app/controllers/CommentsController");

router.post("/create", CommentsController.createComment);
router.get("/:idBlog", CommentsController.getCommentWithIdBlog);

module.exports = router;
