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

router.post("/create", protect, kassaPrixodCreate);
router.get("/get/all/", protect, getAllKassaPrixod);
router.put("/update/:id", protect, updateKassaPrixodBank);
router.delete("/delete/:id", protect, deleteKassaPrixodRasxod);
router.get("/get/element/by/:id", protect, getElementByIdKassaPrixod);

module.exports = router;
