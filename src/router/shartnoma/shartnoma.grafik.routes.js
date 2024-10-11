const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
  getAllGrafik,
  getElementByIdGrafik,
  updateShartnomaGrafik,
} = require("../../controller/shartnoma/shartnoma.grafik.controller");

router.get("/", getAllGrafik);
router.get("/:id", getElementByIdGrafik);
router.put("/:id", updateShartnomaGrafik);

module.exports = router;
