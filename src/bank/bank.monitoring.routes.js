const { Router } = require("express");
const router = Router();

const { getAllBankMonitoring, capExcelCreate, dailyExcelCreate } = require("./bank.monitoring.controller");

router.get('/cap', capExcelCreate)
router.get("/", getAllBankMonitoring);
router.get(`/daily`, dailyExcelCreate)

module.exports = router;
