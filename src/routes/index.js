const express = require("express");
const personnelRoutes = require("./personnelRoutes");
const router = express.Router();

const vehicleRoutes = require("./vehicleRoutes");
const riderRoutes = require("./riderRoutes");


router.use("/vehicles", vehicleRoutes);
router.use("/personnel", personnelRoutes);
router.use("/riders", riderRoutes);
router.use("/personnel", personnelRoutes);

module.exports = router;
