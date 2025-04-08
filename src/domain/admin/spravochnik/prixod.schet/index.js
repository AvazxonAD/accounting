const { Controller } = require("./controller");
const { validator } = require("@helper/validator");
const { Jur8SchetsSchema } = require("./schema");

const { Router } = require("express");
const router = Router();

router
  .post("/", validator(Controller.create, Jur8SchetsSchema.create()))
  .get("/:id", validator(Controller.getById, Jur8SchetsSchema.getById()))
  .put("/:id", validator(Controller.update, Jur8SchetsSchema.update()))
  .delete("/:id", validator(Controller.delete, Jur8SchetsSchema.delete()))
  .get("/", validator(Controller.get, Jur8SchetsSchema.get()));

module.exports = router;
