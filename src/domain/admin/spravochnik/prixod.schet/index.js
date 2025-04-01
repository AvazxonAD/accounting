const { Controller } = require("./controller");
const { validator } = require("@helper/validator");
const { PrixodSchetsSchema } = require("./schema");

const { Router } = require("express");
const router = Router();

router
  .post("/", validator(Controller.create, PrixodSchetsSchema.create()))
  .get("/:id", validator(Controller.getById, PrixodSchetsSchema.getById()))
  .put("/:id", validator(Controller.update, PrixodSchetsSchema.update()))
  .delete("/:id", validator(Controller.delete, PrixodSchetsSchema.delete()))
  .get("/", validator(Controller.get, PrixodSchetsSchema.get()));

module.exports = router;
