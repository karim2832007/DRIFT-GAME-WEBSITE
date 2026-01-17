const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  username: String,
  email: String,
  comment: String,
  date: { type: Date, default: Date.now },
  banned: { type: Boolean, default: false }
});

module.exports = mongoose.model("Comment", commentSchema);