const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { KassaRasxodSchema } = require("./schema");
const { Controller } = require("./controller");

router
  .post("/", validator(Controller.create, KassaRasxodSchema.create()))
  .get("/", validator(Controller.get, KassaRasxodSchema.get()))
  .put("/:id", validator(Controller.update, KassaRasxodSchema.update()))
  .delete("/:id", validator(Controller.delete, KassaRasxodSchema.delete()))
  .get("/:id", validator(Controller.getById, KassaRasxodSchema.getById()));

module.exports = router;
