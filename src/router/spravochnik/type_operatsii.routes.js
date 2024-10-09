const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
  createTypeOperatsii,
  getTypeOperatsii,
  updateTypeOperatsii,
  deleteTypeOperatsii,
  getByIdTypeOperatsii,
} = require("../../controller/spravochnik/type_operatsii.controller");

const upload = require("../../utils/protect.file");

router.post("/", protect, createTypeOperatsii);
router.get("/", protect, getTypeOperatsii);
router.put("/:id", protect, updateTypeOperatsii);
router.delete("/:id", protect, deleteTypeOperatsii);
router.get("/:id", protect, getByIdTypeOperatsii);

module.exports = router;
