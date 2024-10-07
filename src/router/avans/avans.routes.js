const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");

const {
  jur_4_create,
  getAllJur_4,
  getElementByIdjur_4,
  jur_4_update,
  delete_jur_4,
} = require("../../controller/avans/avans.controller");

router.post("/", protect, jur_4_create);
router.get("/", protect, getAllJur_4);
router.put("/:id", protect, jur_4_update);
router.delete("/:id", protect, delete_jur_4);
router.get("/:id", protect, getElementByIdjur_4);

module.exports = router;
