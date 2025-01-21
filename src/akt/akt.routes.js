const { Router } = require("express");
const router = Router();

const { protect } = require("../middleware/auth");

const {
  jur_3_create,
  jur_3_get_all,
  jur_3_update,
  getElementByIdJur_3,
  deleteJur_3,
  jur3Cap
} = require("./akt.controller");


router.post("/", jur_3_create);
router.get('/export/cap', jur3Cap)
router.get("/", jur_3_get_all);
router.put("/:id", jur_3_update);
router.delete("/:id", deleteJur_3);
router.get("/:id", getElementByIdJur_3);


module.exports = router;
