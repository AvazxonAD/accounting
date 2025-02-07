const { Router } = require("express");
const router = Router();
const { validator } = require('../../helper/validator');

const {
  createOperatsii,
  getOperatsii,
  updateOperatsii,
  deleteOperatsii,
  getByIdOperatsii,
  getSchet,
  Controller
} = require("./controller");

router
  .get('/schet', getSchet)
  .get("/unique", validator(Controller.uniqueSchets))
  .get("/:id", getByIdOperatsii)
  .post("/", createOperatsii)
  .get("/", getOperatsii)
  .put("/:id", updateOperatsii)
  .delete("/:id", deleteOperatsii);

module.exports = router;
