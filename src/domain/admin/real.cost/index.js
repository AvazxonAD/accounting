const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { RealCostSchema } = require("./schema");
const { Controller } = require("./controller");

router
  .get("/", validator(Controller.get, RealCostSchema.get()))
  .put("/:id", validator(Controller.update, RealCostSchema.update()))
  .get("/:id", validator(Controller.getById, RealCostSchema.getById()));

module.exports = router;
