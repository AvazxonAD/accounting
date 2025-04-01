const { Router } = require("express");
const router = Router();
const { validator } = require("@helper/validator");
const { OperatsiiSchema } = require("./schema");

const {
  createOperatsii,
  getOperatsii,
  updateOperatsii,
  deleteOperatsii,
  getByIdOperatsii,
  getSchet,
  Controller,
} = require("./controller");

router
  .get("/schet", getSchet)
  .get(
    "/unique",
    validator(Controller.getUniqueSchets, OperatsiiSchema.getUniqueSchets())
  )
  .get("/:id", getByIdOperatsii)
  .post("/", createOperatsii)
  .get("/", getOperatsii)
  .get("/template")
  .put("/:id", updateOperatsii)
  .delete("/:id", deleteOperatsii);

module.exports = router;
