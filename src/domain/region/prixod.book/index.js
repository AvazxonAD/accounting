const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { PrixodBookSchema } = require("./schema");
const { Controller } = require("./controller");

router
  .post("/", validator(Controller.create, PrixodBookSchema.create()))
  .get("/", validator(Controller.get, PrixodBookSchema.get()))
  .get("/type", validator(Controller.gerPrixodBookType))
  .get("/data", validator(Controller.getData, PrixodBookSchema.getData()))
  .put("/:id", validator(Controller.update, PrixodBookSchema.update()))
  .delete("/:id", validator(Controller.delete, PrixodBookSchema.delete()))
  .get("/:id", validator(Controller.getById, PrixodBookSchema.getById()));

module.exports = router;
