const mongoose = require("mongoose");

const downloadSchema = new mongoose.Schema({
  label: String,
  url: String
});

module.exports = mongoose.model("Download", downloadSchema);