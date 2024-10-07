const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");

const {
  jur_3_create,
  jur_3_get_all,
  jur_3_update,
  getElementByIdJur_3,
  deleteJur_3,
} = require("../../controller/akt/akt.controller");

router.post("/", protect, jur_3_create);
router.get("/", protect, jur_3_get_all);
router.put("/:id", protect, jur_3_update);
router.delete("/:id", protect, deleteJur_3);
router.get("/:id", protect, getElementByIdJur_3);


module.exports = router;
