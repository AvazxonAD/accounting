const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
  create,
  getSmetaGrafik,
  update,
  deleteValue,
  getElemnetById,
} = require("../../controller/smeta/smeta.grafik.controller");

router.get("/:id", getElemnetById);
router.get("/", getSmetaGrafik);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", deleteValue);

module.exports = router;
