const { Controller } = require("./controller");
const { validator } = require("@helper/validator");
const { RasxodSchema } = require("./schema");

const { Router } = require("express");
const router = Router();

router
  .post("/", validator(Controller.create, RasxodSchema.create()))
  .get("/:id", validator(Controller.getById, RasxodSchema.getById()))
  .put("/:id", validator(Controller.update, RasxodSchema.update()))
  .delete("/:id", validator(Controller.delete, RasxodSchema.delete()))
  .get("/", validator(Controller.get, RasxodSchema.get()));

module.exports = router;
