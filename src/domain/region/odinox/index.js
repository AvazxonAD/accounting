const { Router } = require("express");
const router = Router();

const { validator } = require("@helper/validator");
const { OdinoxSchema } = require("./schema");
const { Controller } = require("./controller");

router

  .get("/type", validator(Controller.getOdinoxType))
  .get("/data", validator(Controller.getData, OdinoxSchema.getData()))
  .get("/smeta", validator(Controller.getSmeta, OdinoxSchema.getSmeta()));

module.exports = router;
