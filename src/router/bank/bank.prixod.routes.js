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

router.post("/", protect, create);
router.put("/:id", protect, bank_prixod_update);
router.get("/", protect, getAllBankPrixod);
router.delete("/:id", protect, delete_bank_prixod);
router.get("/:id", protect, getElementByIdBankPrixod);

module.exports = router;
