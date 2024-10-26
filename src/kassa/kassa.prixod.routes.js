const { Router } = require("express");
const router = Router();

const { protect } = require("../middleware/auth");

const {
  kassaPrixodCreate,
  getAllKassaPrixod,
  updateKassaPrixodBank,
  deleteKassaPrixodRasxod,
  getElementByIdKassaPrixod,
} = require("./kassa.prixod.controler");

router.post("/", kassaPrixodCreate);
router.get("/", getAllKassaPrixod);
router.put("/:id", updateKassaPrixodBank);
router.delete("/:id", deleteKassaPrixodRasxod);
router.get("/:id", getElementByIdKassaPrixod);

module.exports = router;
