const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
    getAllBankMonitoring
} = require("../../controller/bank/bank.monitoring");

router.get("/get/all", protect, getAllBankMonitoring);

module.exports = router;
