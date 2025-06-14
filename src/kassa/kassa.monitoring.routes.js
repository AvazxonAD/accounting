const { Router } = require("express");
const router = Router();

const {
  getAllKassaMonitoring,
  capExcelCreate,
  dailyExcelCreate
} = require("./kassa.monitoring.controller");

router.get("/", getAllKassaMonitoring);
router.get("/cap", capExcelCreate);
router.get(`/daily`, dailyExcelCreate)

module.exports = router;
