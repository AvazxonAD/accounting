const { Router } = require("express");
const router = Router();

const { protect } = require("@middleware/auth");
const {
  createTypeOperatsii,
  getTypeOperatsii,
  updateTypeOperatsii,
  deleteTypeOperatsii,
  getById,
} = require("./type_operatsii.controller");

const { uploadExcel } = require("@utils/protect.file");

router.post("/", createTypeOperatsii);
router.get("/", getTypeOperatsii);
router.put("/:id", updateTypeOperatsii);
router.delete("/:id", deleteTypeOperatsii);
router.get("/:id", getById);

module.exports = router;
