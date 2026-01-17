const express = require("express");
const router = express.Router();
const { getLayout } = require("../controllers/layoutController");

router.get("/", getLayout);

module.exports = router;