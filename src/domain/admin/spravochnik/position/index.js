const { Controller } = require("./controller");
const { validator } = require("@helper/validator");
const { PositionsSchema } = require("./schema");

const { Router } = require("express");
const router = Router();

router
  .post("/", validator(Controller.create, PositionsSchema.create()))
  .get("/:id", validator(Controller.getById, PositionsSchema.getById()))
  .put("/:id", validator(Controller.update, PositionsSchema.update()))
  .delete("/:id", validator(Controller.delete, PositionsSchema.delete()))
  .get("/", validator(Controller.get, PositionsSchema.get()));

module.exports = router;
