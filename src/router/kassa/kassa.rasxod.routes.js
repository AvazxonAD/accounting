const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");

const {
  kassaRasxodCreate,
  getAllKassaRasxod,
  updateKassaRasxodBank,
  deleteKassaRasxodRasxod,
  getElementByIdKassaRasxod,
} = require("../../controller/kassa/kassa.rasxod.controller");

router.post("/", protect, kassaRasxodCreate);
router.get("/", protect, getAllKassaRasxod);
router.put("/:id", protect, updateKassaRasxodBank);
router.delete("/:id", protect, deleteKassaRasxodRasxod);
router.get("/:id", protect, getElementByIdKassaRasxod);

module.exports = router;
