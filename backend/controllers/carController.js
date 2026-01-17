const Car = require("../models/carModel");

exports.getCars = async (req, res) => {
  const cars = await Car.find();
  res.json(cars);
};