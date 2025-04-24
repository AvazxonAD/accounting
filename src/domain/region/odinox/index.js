const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { OdinoxSchema } = require("./schema");
const { Controller } = require("./controller");

router
  .post("/", validator(Controller.create, OdinoxSchema.create()))
  .get("/", validator(Controller.get, OdinoxSchema.get()))
  .get("/type", validator(Controller.getOdinoxType))
  .get("/data", validator(Controller.getData, OdinoxSchema.getData()))
  .get("/smeta", validator(Controller.getSmeta, OdinoxSchema.getSmeta()))
  .delete("/:id", validator(Controller.delete, OdinoxSchema.delete()))
  .put("/:id", validator(Controller.update, OdinoxSchema.update()))
  .get("/:id", validator(Controller.getById, OdinoxSchema.getById()));

module.exports = router;
