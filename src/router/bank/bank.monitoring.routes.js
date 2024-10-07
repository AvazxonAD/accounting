const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
  getAllBankMonitoring,
} = require("../../controller/bank/bank.monitoring.controller");

router.get("/", protect, getAllBankMonitoring);

module.exports = router;
