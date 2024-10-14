const { Router } = require("express");
const router = Router();

const { getAllBankMonitoring, capExcelCreate } = require("../../controller/bank/bank.monitoring.controller");

router.get('/cap', capExcelCreate)
router.get("/", getAllBankMonitoring);

module.exports = router;
