const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { PrixodBookSchema } = require("./schema");
const { Controller } = require("./controller");

router
  .get("/", validator(Controller.get, PrixodBookSchema.get()))
  .put("/:id", validator(Controller.update, PrixodBookSchema.update()))
  .get("/:id", validator(Controller.getById, PrixodBookSchema.getById()));

module.exports = router;
