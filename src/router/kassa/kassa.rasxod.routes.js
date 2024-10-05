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

router.post("/create", protect, kassaRasxodCreate);
router.get("/get/all/", protect, getAllKassaRasxod);
router.put("/update/:id", protect, updateKassaRasxodBank);
router.delete("/delete/:id", protect, deleteKassaRasxodRasxod);
router.get("/get/element/by/:id", protect, getElementByIdKassaRasxod);

module.exports = router;
