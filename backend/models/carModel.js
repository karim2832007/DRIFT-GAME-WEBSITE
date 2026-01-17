const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  name: String,
  image: String
});

module.exports = mongoose.model("Car", carSchema);