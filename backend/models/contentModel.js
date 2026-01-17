const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  page: { type: String, required: true, unique: true },
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  description: { type: String, default: "" }
});

module.exports = mongoose.model("Content", contentSchema);