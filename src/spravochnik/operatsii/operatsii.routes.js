const { Router } = require("express");
const router = Router();

const {
  createOperatsii,
  getOperatsii,
  updateOperatsii,
  deleteOperatsii,
  getByIdOperatsii,
  getSchet,
  forFilter
} = require("./operatsii.controller");

router.get('/filter', forFilter)
router.get('/schet', getSchet)
router.get("/:id", getByIdOperatsii);
router.post("/", createOperatsii);
router.get("/", getOperatsii);
router.put("/:id", updateOperatsii);
router.delete("/:id", deleteOperatsii);

module.exports = router;
