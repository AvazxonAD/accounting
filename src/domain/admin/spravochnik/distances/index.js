const { Controller } = require("./controller");
const { validator } = require("@helper/validator");
const { DistancesSchema } = require("./schema");

const { Router } = require("express");
const router = Router();

router
  .post("/", validator(Controller.create, DistancesSchema.create()))
  .get("/:id", validator(Controller.getById, DistancesSchema.getById()))
  .put("/:id", validator(Controller.update, DistancesSchema.update()))
  .delete("/:id", validator(Controller.delete, DistancesSchema.delete()))
  .get("/", validator(Controller.get, DistancesSchema.get()));

module.exports = router;
