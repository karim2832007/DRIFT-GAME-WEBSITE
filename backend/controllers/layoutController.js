const Layout = require("../models/layoutModel");

exports.getLayout = async (req, res) => {
  let layout = await Layout.findOne();
  if (!layout) layout = await Layout.create({});
  res.json(layout);
};