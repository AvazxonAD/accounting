const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");

const {
  kassaPrixodCreate,
  getAllKassaPrixod,
  updateKassaPrixodBank,
  deleteKassaPrixodRasxod,
  getElementByIdKassaPrixod,
} = require("../../controller/kassa/kassa.prixod.controler");

router.post("/", protect, kassaPrixodCreate);
router.get("/", protect, getAllKassaPrixod);
router.put("/:id", protect, updateKassaPrixodBank);
router.delete("/:id", protect, deleteKassaPrixodRasxod);
router.get("/:id", protect, getElementByIdKassaPrixod);

module.exports = router;
