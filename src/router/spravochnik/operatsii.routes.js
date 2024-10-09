const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
  createOperatsii,
  getOperatsii,
  updateOperatsii,
  deleteOperatsii,
  getByIdOperatsii,
} = require("../../controller/spravochnik/operatsii.controller");

const upload = require("../../utils/protect.file");

router.get("/:id", protect, getByIdOperatsii);
router.post("/", protect, createOperatsii);
router.get("/", protect, getOperatsii);
router.put("/:id", protect, updateOperatsii);
router.delete("/:id", protect, deleteOperatsii);

module.exports = router;
