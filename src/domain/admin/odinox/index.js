const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { OdinoxSchema } = require("./schema");
const { Controller } = require("./controller");

router
  .get("/", validator(Controller.get, OdinoxSchema.get()))
  .put("/:id", validator(Controller.update, OdinoxSchema.update()))
  .get("/:id", validator(Controller.getById, OdinoxSchema.getById()));

module.exports = router;
