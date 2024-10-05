const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");

const {
  jur_3_create,
  jur_3_get_all,
  jur_3_update,
  getElementByIdJur_3,
  deleteJur_3,
} = require("../../controller/bajarilgan_ishlar/jur_3.controller");

router.post("/create", protect, jur_3_create);
router.get("/get/all", protect, jur_3_get_all);
router.put("/update/:id", protect, jur_3_update);
router.delete("/delete/:id", protect, deleteJur_3);
router.get("/get/element/by/:id", protect, getElementByIdJur_3);


module.exports = router;
