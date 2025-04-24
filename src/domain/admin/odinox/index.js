const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { MainBookSchema } = require("./schema");
const { Controller } = require("./controller");

router
  .get("/", validator(Controller.get, MainBookSchema.get()))
  .put("/:id", validator(Controller.update, MainBookSchema.update()))
  .get("/:id", validator(Controller.getById, MainBookSchema.getById()));

module.exports = router;
