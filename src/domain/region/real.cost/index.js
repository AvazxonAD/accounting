const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { RealCostSchema } = require("./schema");
const { Controller } = require("./controller");

router
  .get("/data", validator(Controller.getData, RealCostSchema.getData()))
  .get("/", validator(Controller.get, RealCostSchema.get()))
  .get("/docs", validator(Controller.get, RealCostSchema.get()))
  .post("/", validator(Controller.create, RealCostSchema.create()))
  .get("/:id", validator(Controller.getById, RealCostSchema.getById()))
  .put("/:id", validator(Controller.update, RealCostSchema.update()))
  .delete("/:id", validator(Controller.delete, RealCostSchema.delete()));

module.exports = router;
