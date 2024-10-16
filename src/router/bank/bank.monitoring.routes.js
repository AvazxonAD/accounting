const { Router } = require("express");
const router = Router();

const { getAllBankMonitoring, capExcelCreate, dailyExcelCreate } = require("../../controller/bank/bank.monitoring.controller");

router.get('/cap', capExcelCreate)
router.get("/", getAllBankMonitoring);
router.get(`/daily`, dailyExcelCreate)

module.exports = router;
