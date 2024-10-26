const { Router } = require("express");
const router = Router();

const { protect } = require("../middleware/auth");

const {
  jur_4_create,
  getAllJur_4,
  getElementByIdjur_4,
  jur_4_update,
  delete_jur_4,
} = require("./avans.controller");

router.post("/", jur_4_create);
router.get("/", getAllJur_4);
router.put("/:id", jur_4_update);
router.delete("/:id", delete_jur_4);
router.get("/:id", getElementByIdjur_4);

module.exports = router;
