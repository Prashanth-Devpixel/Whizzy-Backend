const express = require("express");
const router = express.Router();
const {createEV, getVehiclesByLocation, getVehicleInfo } = require("../controllers/vehicleController");
const authMiddleware = require("../middlewares/authMiddleware");


router.get("/", authMiddleware, getVehiclesByLocation);
router.post("/", authMiddleware, createEV);
router.get("/:vehicleId", authMiddleware, getVehicleInfo);

module.exports = router;
