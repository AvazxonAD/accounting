const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { OdinoxSchema } = require("./schema");
const { Controller } = require("./controller");

router
  .post("/", validator(Controller.create, OdinoxSchema.create()))
  .get("/type", validator(Controller.getOdinoxType))
  .get("/data", validator(Controller.getData, OdinoxSchema.getData()))
  .get("/smeta", validator(Controller.getSmeta, OdinoxSchema.getSmeta()));

module.exports = router;
