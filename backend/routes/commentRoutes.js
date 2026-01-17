const express = require("express");
const router = express.Router();

const {
  getComments,
  postComment,
  banComment,
  deleteComment
} = require("../controllers/commentController");

// Public routes
router.get("/", getComments);
router.post("/", postComment);

// Admin moderation routes
router.post("/ban/:id", banComment);
router.delete("/delete/:id", deleteComment);

module.exports = router;