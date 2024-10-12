const { Router } = require("express");
const router = Router();

const { getAllBankMonitoring } = require("../../controller/bank/bank.monitoring.controller");

router.get("/", getAllBankMonitoring);

module.exports = router;
