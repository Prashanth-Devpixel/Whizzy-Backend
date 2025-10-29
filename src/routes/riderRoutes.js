const express = require("express");
const router = express.Router();
const { getRidersByLocation } = require("../controllers/riderController");
const authMiddleware = require("../middlewares/authMiddleware");

// ✅ GET /api/riders?location=Chennai&pageToken=xxxx
router.get("/", authMiddleware, getRidersByLocation);

module.exports = router;
