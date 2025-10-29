const express = require("express");
const router = express.Router();
const { importPersonnel, getPersonnelInfo } = require("../controllers/personnelController");
const authMiddleware = require("../middlewares/authMiddleware");

// POST /api/personnel/import
router.post("/import", authMiddleware, importPersonnel);
router.get("/:userId", authMiddleware, getPersonnelInfo);

module.exports = router;
