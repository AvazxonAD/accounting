const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { MainBookSchema } = require("./schema");
const { Controller } = require("./controller");

router
  .post("/", validator(Controller.create, MainBookSchema.create()))
  .get("/", validator(Controller.get, MainBookSchema.get()))
  .get("/type", validator(Controller.getMainBookType))
  .get("/data", validator(Controller.getData))
  .put("/:id", validator(Controller.update, MainBookSchema.update()))
  .delete("/:id", validator(Controller.delete, MainBookSchema.delete()))
  .get("/:id", validator(Controller.getById, MainBookSchema.getById()));

module.exports = router;
