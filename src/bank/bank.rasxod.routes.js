const { Router } = require("express");
const router = Router();

const {
  bank_rasxod,
  bank_rasxod_update,
  getAllBankRasxod,
  delete_bank_rasxod,
  getElementByIdBankRasxod,
  getFioBankRasxod
} = require("./bank.rasxod.controller");

router.get('/fio', getFioBankRasxod)
router.post("/", bank_rasxod);
router.put("/:id", bank_rasxod_update);
router.get("/", getAllBankRasxod);
router.delete("/:id", delete_bank_rasxod);
router.get("/:id", getElementByIdBankRasxod);

module.exports = router;
