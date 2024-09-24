const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
  bank_rasxod,
  bank_rasxod_update,
  getAllBankRasxod,
  delete_bank_rasxod,
  getElementByIdBankRasxod,
} = require("../../controller/bank/bank.rasxod.controller");

router.post("/create", protect, bank_rasxod);
router.put("/update/:id", protect, bank_rasxod_update);
router.get("/get/all", protect, getAllBankRasxod);
router.delete("/delete/:id", protect, delete_bank_rasxod);
router.get("/get/element/by/:id", protect, getElementByIdBankRasxod);

module.exports = router;
