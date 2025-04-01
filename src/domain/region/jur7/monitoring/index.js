const { Controller } = require("./controller");
const { validator } = require("@helper/validator");
const { Schema } = require("./schema");

const { Router } = require("express");
const router = Router();

router
  .get("/cap/report", validator(Controller.cap, Schema.capSchema()))
  .get(
    "/material/report",
    validator(Controller.materialReport, Schema.getMaterialSchema())
  );

module.exports = router;
