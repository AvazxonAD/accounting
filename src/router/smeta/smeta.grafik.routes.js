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

router.get("/:id", protect, getElemnetById);
router.get("/", protect, getSmetaGrafik);
router.post("/", protect, create);
router.put("/:id", protect, update);
router.delete("/:id", protect, deleteValue);

module.exports = router;
