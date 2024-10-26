const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
  createOperatsii,
  getOperatsii,
  updateOperatsii,
  deleteOperatsii,
  getByIdOperatsii,
} = require("./operatsii.controller");

const upload = require("../../utils/protect.file");

router.get("/:id", getByIdOperatsii);
router.post("/", createOperatsii);
router.get("/", getOperatsii);
router.put("/:id", updateOperatsii);
router.delete("/:id", deleteOperatsii);

module.exports = router;
