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

router.post("/", kassaRasxodCreate);
router.get("/", getAllKassaRasxod);
router.put("/:id", updateKassaRasxodBank);
router.delete("/:id", deleteKassaRasxodRasxod);
router.get("/:id", getElementByIdKassaRasxod);

module.exports = router;
