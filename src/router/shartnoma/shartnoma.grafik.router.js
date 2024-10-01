const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
  getAllGrafik,
  getElementByIdGrafik,
  updateShartnomaGrafik
} = require("../../controller/shartnoma/shartnoma.grafik.controller");

router.get("/get/all", protect, getAllGrafik);
router.get('/get/element/by/:id', protect, getElementByIdGrafik)
router.put('/update/:id', protect, updateShartnomaGrafik)


module.exports = router;
