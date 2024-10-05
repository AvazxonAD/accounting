const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");

const {
  jur_4_create,
  getAllJur_4,
  getElementByIdjur_4,
  jur_4_update,
  delete_jur_4,
} = require("../../controller/avans_otchetlar/jur_4.controller");

router.post("/create", protect, jur_4_create);
router.get("/get/all", protect, getAllJur_4);
router.put("/update/:id", protect, jur_4_update);
router.delete("/delete/:id", protect, delete_jur_4);
router.get("/get/element/by/:id", protect, getElementByIdjur_4);

module.exports = router;
