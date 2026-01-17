const mongoose = require("mongoose");

const layoutSchema = new mongoose.Schema({
  showCars: { type: Boolean, default: true },
  showComments: { type: Boolean, default: true },
  showDownloads: { type: Boolean, default: true },
  showSocialLinks: { type: Boolean, default: true }
});

module.exports = mongoose.model("Layout", layoutSchema);