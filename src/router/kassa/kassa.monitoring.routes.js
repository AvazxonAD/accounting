const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
  getAllKassaMonitoring,
} = require("../../controller/kassa/kassa.monitoring.controller");

router.get("/", getAllKassaMonitoring);

module.exports = router;
