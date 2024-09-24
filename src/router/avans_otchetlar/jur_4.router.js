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

router.post("/jur_4/create", protect, jur_4_create);
router.get("/jur_4/get/all", protect, getAllJur_4);
router.put("/jur_4/update/:id", protect, jur_4_update);
router.delete("/jur_4/delete/:id", protect, delete_jur_4);
router.get("/jur_4/get/element/by/id/:id", protect, getElementByIdjur_4);

module.exports = router;
