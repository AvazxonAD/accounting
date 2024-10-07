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

router.post("/", protect, bank_rasxod);
router.put("/:id", protect, bank_rasxod_update);
router.get("/", protect, getAllBankRasxod);
router.delete("/:id", protect, delete_bank_rasxod);
router.get("/:id", protect, getElementByIdBankRasxod);

module.exports = router;
