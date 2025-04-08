const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { MainBookSchema } = require("./schema");
const { Controller } = require("./controller");

router
  .post("/", validator(Controller.create, MainBookSchema.create()))
  .get("/", validator(Controller.get, MainBookSchema.get()))
  .delete("/clean", validator(Controller.cleanData, MainBookSchema.cleanData()))
  .get(
    "/unique",
    validator(Controller.getUniqueSchets, MainBookSchema.getUniqueSchets())
  )
  .get(
    "/check",
    validator(Controller.getCheckFirst, MainBookSchema.getCheckFirst())
  )
  .get("/type", validator(Controller.getMainBookType))
  .get("/data", validator(Controller.getData, MainBookSchema.getData()))
  .put("/:id", validator(Controller.update, MainBookSchema.update()))
  .delete("/:id", validator(Controller.delete, MainBookSchema.delete()))
  .get("/:id", validator(Controller.getById, MainBookSchema.getById()));

module.exports = router;
