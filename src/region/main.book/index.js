const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { MainBookSchema } = require("./schema");
const { Controller } = require("./controller");

router
  .post("/", validator(Controller.create, MainBookSchema.create()))
  .get("/", validator(Controller.get, MainBookSchema.get()))
  .get("/data", validator(Controller.getData))
  .get("/:id", validator(Controller.getById, MainBookSchema.getById()));

module.exports = router;
