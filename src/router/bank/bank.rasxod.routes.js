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

router.post("/", bank_rasxod);
router.put("/:id", bank_rasxod_update);
router.get("/", getAllBankRasxod);
router.delete("/:id", delete_bank_rasxod);
router.get("/:id", getElementByIdBankRasxod);

module.exports = router;
