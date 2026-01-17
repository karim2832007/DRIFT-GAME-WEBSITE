const Download = require("../models/downloadModel");

exports.getDownloads = async (req, res) => {
  let downloads = await Download.find();

  if (downloads.length === 0) {
    downloads = await Download.insertMany([
      { label: "Windows Build", url: "#" },
      { label: "Android APK", url: "#" }
    ]);
  }

  res.json(downloads);
};