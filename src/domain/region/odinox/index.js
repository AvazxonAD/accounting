const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { OdinoxSchema } = require("./schema");
const { Controller } = require("./controller");

router

  .get("/type", validator(Controller.getOdinoxType))
  .get("/data", validator(Controller.getData, OdinoxSchema.getData()))

  .get("/unique", validator(Controller.getSmeta, OdinoxSchema.getSmeta()))

  .post("/", validator(Controller.create, OdinoxSchema.create()))
  .get("/", validator(Controller.get, OdinoxSchema.get()))
  .delete("/clean", validator(Controller.cleanData, OdinoxSchema.cleanData()))
  .get("/docs", validator(Controller.getDocs, OdinoxSchema.getDocs()))
  .get(
    "/check",
    validator(Controller.getCheckFirst, OdinoxSchema.getCheckFirst())
  )
  .put("/:id", validator(Controller.update, OdinoxSchema.update()))
  .delete("/:id", validator(Controller.delete, OdinoxSchema.delete()))
  .get("/:id", validator(Controller.getById, OdinoxSchema.getById()));

module.exports = router;
