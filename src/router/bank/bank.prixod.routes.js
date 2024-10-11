const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
  create,
  bank_prixod_update,
  getAllBankPrixod,
  delete_bank_prixod,
  getElementByIdBankPrixod,
} = require("../../controller/bank/bank.prixod.controller");

router.post("/", create);
router.put("/:id", bank_prixod_update);
router.get("/", getAllBankPrixod);
router.delete("/:id", delete_bank_prixod);
router.get("/:id", getElementByIdBankPrixod);

module.exports = router;
