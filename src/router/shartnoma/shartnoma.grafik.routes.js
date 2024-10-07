const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
  getAllGrafik,
  getElementByIdGrafik,
  updateShartnomaGrafik,
} = require("../../controller/shartnoma/shartnoma.grafik.controller");

router.get("/", protect, getAllGrafik);
router.get("/:id", protect, getElementByIdGrafik);
router.put("/:id", protect, updateShartnomaGrafik);

module.exports = router;
