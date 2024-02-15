const express = require("express");
const router = express.Router();

const {listings, listingSummary} = require("../controllers/index.js")


router.get("/", listingSummary);
router.get("/listings", listings);

module.exports = router;